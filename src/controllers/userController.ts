import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User";
import Expense from "../models/Expense";
import TransactionCategory from "../models/TransactionCategory";

import validateEmail from "../functions/validateEmail";
import sendResetToken from "../functions/sendResetToken";
import generateToken from "../functions/generateToken";
import getParamsFromToken from "../functions/getParamsFromToken";

export default {
  async signUp(req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
      if (!name) {
        return res.status(404).json({ error: "Name is required." });
      }

      if (name.length < 4) {
        return res.status(406).json({ error: "Name too short." });
      }

      if (!email) {
        return res.status(404).json({ error: "Email is required." });
      }

      if (!validateEmail(email)) {
        return res.status(406).json({ error: "Email is not valid." });
      }

      if (await User.findOne({ email })) {
        return res.status(406).json({ error: "This email is already in use." });
      }

      if (!password) {
        return res.status(404).json({ error: "Password is required." });
      }

      if (password.length < 6) {
        return res.status(406).json({ error: "Password too short." });
      }

      const userData = {
        name,
        email,
        password,
      };

      const user = await User.create(userData);

      user.password = undefined;

      const responseData = {
        token: generateToken({
          userId: user._id,
          passwordVersion: user.passwordVersion,
        }),
        user: {
          name: user.name,
          admin: user.admin,
          hasInitialData: false,
          createdAt: user.createdAt,
        },
      };

      return res.status(201).json(responseData);
    } catch (err) {
      return res.status(500);
    }
  },

  async signIn(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email })
        .select("+password")
        .select("+passwordVersion");

      if (!user) {
        return res.status(404).json({ error: "Email not found." });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(406).json({ error: "Password not match." });
      }

      let hasInitialData: Boolean = false;

      if (user.incomeValue) {
        hasInitialData = true;
      }

      user.password = undefined;

      const responseData = {
        token: generateToken({
          userId: user._id,
          passwordVersion: user.passwordVersion,
        }),
        user: {
          name: user.name,
          admin: user.admin,
          hasInitialData,
          createdAt: user.createdAt,
        },
      };

      return res.status(200).json(responseData);
    } catch (err) {
      return res.status(500);
    }
  },

  async sendResetPasswordToken(req: Request, res: Response) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      let expiresDate = new Date(Date.now());

      expiresDate.setMinutes(expiresDate.getMinutes() + 5);

      const token = (Math.floor(Math.random() * 90000) + 10000).toString();

      await sendResetToken({ to: user.email, resetToken: token });

      const hash = await bcrypt.hash(token, 10);

      await User.findByIdAndUpdate(user.id, {
        $set: {
          passwordResetToken: hash,
          passwordResetExpires: expiresDate,
        },
      });

      return res
        .status(200)
        .json({ message: "Reset token sent successfully." });
    } catch (err) {
      return res.status(500);
    }
  },

  async validateResetPasswordToken(req: Request, res: Response) {
    const { email, token } = req.query;

    try {
      if (!validateEmail(email.toString())) {
        return res.status(406).json({ error: "This email is invalid." });
      }

      const user = await User.findOne({ email: email.toString() })
        .select("+passwordResetToken")
        .select("+passwordResetExpires");

      if (!(await bcrypt.compare(token.toString(), user.passwordResetToken))) {
        return res
          .status(406)
          .json({ error: "This reset token does not match." });
      }

      const now = new Date(Date.now());

      const expiresDate = new Date(user.passwordResetExpires);

      if (expiresDate < now) {
        return res.status(406).json({ error: "This token has expired" });
      }

      return res.status(200).json({ message: "Token is valid" });
    } catch (err) {
      return res.status(500);
    }
  },

  async resetPassword(req: Request, res: Response) {
    const { password, email, token } = req.body;

    try {
      if (!validateEmail(email)) {
        return res.status(406).json({ error: "This email is invalid." });
      }

      const user = await User.findOne({ email }).select("+passwordResetToken");

      if (!token) {
        return res
          .status(404)
          .json({ error: "The reset password token is required." });
      }

      if (!user.passwordResetToken) {
        return res
          .status(403)
          .json({ error: "This user did not request password change." });
      }

      if (!(await bcrypt.compare(token, user.passwordResetToken))) {
        return res
          .status(403)
          .json({ error: "This password reset token is invalid." });
      }

      if (password.length < 6) {
        return res.status(406).json({ error: "This password is too short." });
      }

      const hash = await bcrypt.hash(password, 10);

      await User.findByIdAndUpdate(user.id, {
        $set: {
          passwordVersion: user.passwordVersion + 1,
          password: hash,
        },
        $unset: {
          passwordResetToken: "",
          passwordResetExpires: "",
        },
      });

      return res.status(200).json({ message: "Password reset successfully." });
    } catch (err) {
      return res.status(500);
    }
  },

  async initialConfig(req: Request, res: Response) {
    const { categories, incomeValue } = req.body;
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    if (!incomeValue) {
      return res
        .status(404)
        .json({ error: "The user income value is required." });
    }

    try {
      await User.findByIdAndUpdate(userId, {
        $set: {
          incomeValue: incomeValue,
        },
      });

      if (categories.length > 0) {
        categories.map(async (category) => {
          const expenseCategory = await TransactionCategory.findOne({
            _id: category.categoryId,
            income: false,
          });

          if (expenseCategory && expenseCategory.income === false) {
            await Expense.create({
              user: userId,
              category: category.categoryId,
              maxValue: category.maxValue,
            });
          }
        });
      }

      return res
        .status(201)
        .json({ message: "Initial configuration has been saved." });
    } catch (err) {
      return res.status(500);
    }
  },

  async getData(req: Request, res: Response) {
    const { authorization } = req.headers;
    const { userId, passwordVersion } = getParamsFromToken(authorization);

    try {
      const user = await User.findById(userId).select("+passwordVersion");

      if (user.passwordVersion !== passwordVersion) {
        return res
          .status(403)
          .json({ error: "The user password was changed." });
      }

      let hasInitialData: Boolean = false;

      if (user.incomeValue) {
        hasInitialData = true;
      }

      const data = {
        token: generateToken({
          userId: user._id,
          passwordVersion: user.passwordVersion,
        }),
        name: user.name,
        hasInitialData,
        admin: user.admin,
        createdAt: user.createdAt,
      };

      return res.status(200).json(data);
    } catch (err) {
      return res.status(500);
    }
  },
};
