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
        return res.status(404).send({ error: "Name is required." });
      }

      if (name.length < 4) {
        return res.status(406).send({ error: "Name too short." });
      }

      if (!email) {
        return res.status(404).send({ error: "Email is required." });
      }

      if (!validateEmail(email)) {
        return res.status(406).send({ error: "Email is not valid." });
      }

      if (await User.findOne({ email })) {
        return res.status(406).send({ error: "This email is already in use." });
      }

      if (!password) {
        return res.status(404).send({ error: "Password is required." });
      }

      if (password.length < 6) {
        return res.status(406).send({ error: "Password too short." });
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
          hasInitialData: false,
        },
      };

      return res.status(201).send({ user: responseData });
    } catch (err) {
      return res.status(500).send({ error: "Error: " + err });
    }
  },

  async signIn(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email })
        .select("+password")
        .select("+passwordVersion");

      if (!user) {
        return res.status(404).send({ error: "Email not found." });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(406).send({ error: "Password not match." });
      }

      let hasInitialData: Boolean;

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
          hasInitialData,
        },
      };

      return res.status(200).send({ user: responseData });
    } catch (err) {
      return res.status(500).send({ error: "Error: " + err });
    }
  },

  async sendResetPasswordToken(req: Request, res: Response) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).send({ error: "Email not found." });
      }

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
        .send({ message: "Reset token sent successfully." });
    } catch (err) {
      return res.status(500).send({ error: "Error: " + err });
    }
  },

  async validateResetPasswordToken(req: Request, res: Response) {
    const { email, token } = req.params;

    try {
      if (!validateEmail(email)) {
        return res.status(406).send({ error: "This email is invalid." });
      }

      const user = await User.findOne({ email })
        .select("+passwordResetToken")
        .select("+passwordResetExpires");

      if (!user) {
        return res
          .status(406)
          .send({ error: "This email does not have an account." });
      }

      if (!(await bcrypt.compare(token, user.passwordResetToken))) {
        return res
          .status(406)
          .send({ error: "This reset token does not match." });
      }

      const now = new Date(Date.now());

      const expiresDate = new Date(user.passwordResetExpires);

      if (expiresDate < now) {
        return res.status(406).send({ error: "This token has expired" });
      }

      return res.status(200).send({ message: "Token is valid" });
    } catch (err) {
      return res.status(500).send({ error: "Error: " + err });
    }
  },

  async resetPassword(req: Request, res: Response) {
    const { password, email, token } = req.body;

    try {
      if (!validateEmail(email)) {
        return res.status(406).send({ error: "This email is invalid." });
      }

      const user = await User.findOne({ email }).select("+passwordResetToken");

      if (!user) {
        return res
          .status(404)
          .send({ error: "This email does not have an account." });
      }

      if (!token) {
        return res
          .status(404)
          .send({ error: "The reset password token is required." });
      }

      if (!user.passwordResetToken) {
        return res
          .status(403)
          .send({ error: "This user did not request password change." });
      }

      if (!(await bcrypt.compare(token, user.passwordResetToken))) {
        return res
          .status(403)
          .send({ error: "This password reset token is invalid." });
      }

      if (password.length < 6) {
        return res.status(406).send({ error: "This password is too short." });
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

      return res.status(200).send({ message: "Password reset successfully." });
    } catch (err) {
      return res.status(500).send({ error: "Error: " + err });
    }
  },

  async initialConfig(req: Request, res: Response) {
    const { categories, incomeValue } = req.body;
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    if (!incomeValue) {
      return res
        .status(404)
        .send({ error: "The user income value is required." });
    }

    try {
      if (!(await User.findById(userId))) {
        return res.status(406).send({ error: "This user id is invalid." });
      }

      await User.findByIdAndUpdate(userId, {
        $set: {
          incomeValue: incomeValue,
        },
      });

      if (categories.length > 0) {
        categories.map(async (category) => {
          if (await TransactionCategory.findById(category.categoryId)) {
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
        .send({ message: "Initial configuration has been saved." });
    } catch (err) {
      return res.status(500).send({ error: "Error: " + err });
    }
  },

  async getData(req: Request, res: Response) {
    const { authorization } = req.headers;

    const { userId, passwordVersion } = getParamsFromToken(authorization);

    try {
      const user = await User.findById(userId).select("+passwordVersion");

      if (!user) {
        return res.status(406).send({ error: "Invalid user id." });
      }

      if (user.passwordVersion !== passwordVersion) {
        return res
          .status(403)
          .send({ error: "The user password was changed." });
      }

      const data = {
        token: generateToken({
          userId: user._id,
          passwordVersion: user.passwordVersion,
        }),
        name: user.name,
      };

      return res
        .status(200)
        .send({ message: "Data search performed successfully.", data });
    } catch (err) {
      return res.status(500).send({ error: "Error: " + err });
    }
  },
};
