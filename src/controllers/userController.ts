import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User";
import validateEmail from "../functions/validateEmail";
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
  
};
