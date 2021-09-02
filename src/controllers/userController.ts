import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User";

import validateEmail from "../functions/validateEmail";
import sendResetToken from "../functions/sendResetToken";
import generateToken from "../functions/generateToken";

export default {
  async signUp(req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
      if (!name) {
        return res.status(400).send({ error: "Name is required." });
      }

      if (name.length < 4) {
        return res.status(400).send({ error: "Name too short." });
      }

      if (!email) {
        return res.status(400).send({ error: "Email is required." });
      }

      if (!validateEmail(email)) {
        return res.status(400).send({ error: "Email is not valid." });
      }

      if (await User.findOne({ email })) {
        return res.status(400).send({ error: "This email is already in use." });
      }

      if (!password) {
        return res.status(400).send({ error: "Password is required." });
      }

      if (password.length < 6) {
        return res.status(400).send({ error: "Password too short." });
      }

      const userData = {
        name,
        email,
        password,
      };

      const user: any = await User.create(userData);

      user.password = undefined;

      const responseData = {
        token: generateToken({
          userId: user._id,
          passwordVersion: user.passwordVersion,
        }),
        user,
      };

      return res
        .status(201)
        .send({ message: "User successfully created.", user: responseData });
    } catch (err) {
      return res.status(400).send({ error: "Error: " + err });
    }
  },

  async signIn(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email })
        .select("+password")
        .select("+passwordVersion");

      if (!user) {
        return res.status(200).send({ error: "Email not found." });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(200).send({ error: "Password not match." });
      }

      user.password = undefined;

      const responseData = {
        token: generateToken({
          userId: user._id,
          passwordVersion: user.passwordVersion,
        }),
        user,
      };

      return res
        .status(200)
        .send({ message: "Login successfully", user: responseData });
    } catch (err) {
      return res.status(400).send({ error: "Error: " + err });
    }
  },

  async sendResetPasswordToken(req: Request, res: Response) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).send({ error: "Email not found." });
      }

      let expiresDate = new Date(Date.now());

      expiresDate.setMinutes(expiresDate.getMinutes() + 5)

      const token = (Math.floor(Math.random() * 90000) + 10000).toString();

      await sendResetToken({to: user.email, resetToken: token})

      const hash = await bcrypt.hash(token, 10);

      await User.findByIdAndUpdate(user.id, {
        $set: {
          passwordResetToken: hash,
          passwordResetExpires: expiresDate,
        },
      });

      return res.status(200).send({message: "Reset token sent successfully."})

    } catch (err) {
      return res.status(400).send({ error: "Error: " + err });
    }
  },

  async validateResetPasswordToken(req: Request, res: Response) {
    const { email, token } = req.params

    try {
      
      if(!validateEmail(email)) {
        return res.status(400).send({error: "This email is invalid."})
      }

      const user: any = await User.findOne({email}).select("+passwordResetToken").select("+passwordResetExpires")

      if(!user) {
        return res.status(400).send({error: "This email does not have an account."})
      }

      if (!(await bcrypt.compare(token, user.passwordResetToken))) {
        return res.status(200).send({ error: "This reset token does not match." });
      }

      const now = new Date(Date.now())

      const expiresDate = new Date(user.passwordResetExpires)

      if(expiresDate < now) {
        return res.status(400).send({error: "This token has expired"})
      }

      return res.status(200).send({message: "Token is valid"})

    } catch (err) {
      return res.status(400).send({error: "Error: "+err})
    }
  },

  async resetPassword(req: Request, res: Response) {
    const { password, email } = req.body

    try {
      
      if(!validateEmail(email)) {
        return res.status(400).send({error: "This email is invalid."})
      }

      const user: any = await User.findOne({email}).select("+passwordResetToken")

      if(!user) {
        return res.status(400).send({error: "This email does not have an account."})
      }

      if(password.length < 6) {
        return res.status(400).send({error: "This password is too short."})
      }

      const hash = await bcrypt.hash(password, 10);

      await User.findByIdAndUpdate(user.id, {
        $set: {
          passwordVersion: user.passwordVersion + 1,
          password: hash
        },
        $unset: {
          passwordResetToken: undefined,
          passwordResetExpires: undefined
        }
      });

      return res.status(200).send({message: "Password reset successfully."})

    } catch (err) {
      return res.status(400).send({error: "Error: "+err})
    }
  },
};
