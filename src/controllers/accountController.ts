import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import Bank from "../models/Bank";
import Account from "../models/Account";
import Card from "../models/Card";
import User from "../models/User";

import getParamsFromToken from "../functions/getParamsFromToken";

export default {
  async create(req: Request, res: Response) {
    const { authorization } = req.headers;
    const { username, bank, value = 0 } = req.body;

    const { userId } = getParamsFromToken(authorization);

    if (!username) {
      return res
        .status(404)
        .json({ error: "The account username is required." });
    }

    if (!isValidObjectId(bank)) {
      return res.status(404).json({ error: "This bank id is invalid." });
    }

    try {
      if (!(await Bank.findById(bank))) {
        return res.status(404).json({ error: "This bank does not exists." });
      }

      const accountData = {
        username,
        user: userId,
        bank,
        value,
      };

      const account = await Account.create(accountData);

      await User.findByIdAndUpdate(userId, {
        $push: { accounts: account._id },
      });

      return res.status(201).json({ message: "Account created with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async delete(req: Request, res: Response) {
    const { accountId } = req.query;
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    if (!isValidObjectId(accountId)) {
      return res.status(404).json({ error: "This account id is invalid." });
    }

    try {
      const account = await Account.findById(accountId);

      if (!account) {
        return res.status(404).json({ error: "This account does not exists." });
      }

      if (account.user.toString() !== userId) {
        return res
          .status(406)
          .json({ error: "This account does not belong to you." });
      }

      if (account.card) {
        await Card.findByIdAndDelete(account.card);
      }

      await Account.findByIdAndDelete(accountId);
      await User.findByIdAndUpdate(userId, {
        $pull: { accounts: account._id },
      });

      return res.status(200).json({ message: "Account removed with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async getAll(req: Request, res: Response) {
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    try {
      const { accounts } = await User.findById(userId).populate("accounts");

      return res.status(200).json(accounts);
    } catch (err) {
      return res.status(500);
    }
  },
};
