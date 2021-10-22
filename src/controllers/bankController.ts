import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import Bank from "../models/Bank";
import Account from "../models/Account";

export default {
  async create(req: Request, res: Response) {
    const { name, picture } = req.body;

    if (!name) {
      return res.status(404).json({ error: "The bank name is required." });
    }

    if (!picture) {
      return res.status(404).json({ error: "The bank type is required." });
    }

    try {
      if (await Bank.findOne({ name })) {
        return res
          .status(406)
          .json({ error: "Already exists an bank with this name." });
      }

      const bankData = {
        name,
        picture,
      };

      await Bank.create(bankData);

      return res.status(201).json({ message: "Bank created with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async delete(req: Request, res: Response) {
    const { bankId } = req.query;

    if (!isValidObjectId(bankId)) {
      return res.status(404).json({ error: "This bank id is invalid." });
    }

    try {
      if (!(await Bank.findById(bankId))) {
        return res.status(404).json({ error: "This bank does not exists." });
      }

      if (await Account.findOne({ bank: bankId })) {
        return res.status(406).json({
          error:
            "You cannot remove this bank as there are accounts linked to it.",
        });
      }

      await Bank.findByIdAndDelete(bankId);

      return res.status(200).json({ message: "Bank removed with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const banks = await Bank.find().select("-__v");

      return res.status(200).json(banks);
    } catch (err) {
      return res.status(500);
    }
  },
};
