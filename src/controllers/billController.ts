import { Request, Response } from "express";

import Bill from "../models/Bill";

import getParamsFromToken from "../functions/getParamsFromToken";
import { isValidObjectId } from "mongoose";
import Account from "../models/Account";
import TransactionCategory from "../models/TransactionCategory";
import Transaction from "../models/Transaction";

export default {
  async create(req: Request, res: Response) {
    const { remainingValue, interest, paidValue = 0, interestType, title } = req.body;
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    if (!remainingValue) {
      return res.status(404).json({ error: "The bill value is required." });
    }

    if (!title) {
      return res.status(404).json({ error: "The bill title is required." });
    }

    if (!interest) {
      return res
        .status(404)
        .json({ error: "The bill interest value is required." });
    }

    if (!interestType) {
      return res
        .status(404)
        .json({ error: "The bill interest type value is required." });
    }

    try {
      await Bill.create({
        title,
        remainingValue,
        interest,
        interestType,
        user: userId,
        paidValue: paidValue || 0,
      });

      return res.status(201).json({ message: "Bill created." });
    } catch (err) {
      return res.status(500);
    }
  },

  async getAll(req: Request, res: Response) {
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    try {
      const bills = await Bill.find({ user: userId });

      return res.status(200).json(bills);
    } catch (err) {
      return res.status(500);
    }
  },

  async payBills(req: Request, res: Response) {
    const { billId } = req.query;
    const { value, accountId, isCard } = req.body;
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    if (!billId) {
      return res.status(404).json({ error: "The bill id is required." });
    }

    if (!isValidObjectId(billId)) {
      return res.status(406).json({ error: "This bill id is invalid." });
    }

    if (!value) {
      return res.status(404).json({ error: "The paid value is required." });
    }

    if (!accountId) {
      return res.status(404).json({ error: "The account is required." });
    }

    if (!isValidObjectId(accountId)) {
      return res.status(406).json({ error: "This account id is invalid." });
    }

    try {
      const bill = await Bill.findById(billId);

      if (!bill) {
        return res.status(404).json({ error: "This bill id is required." });
      }

      if (bill.user.toString() !== userId) {
        return res
          .status(406)
          .json({ error: "This bill does not belong to you." });
      }

      const account = await Account.findById(accountId);

      if (!account) {
        return res.status(406).json({ error: "" });
      }

      if (value > bill.remainingValue) {
        return res.status(406).json({
          error: "The paid value cannot be more than the bill remaining value.",
        });
      }

      const billCategory = await TransactionCategory.findOne({ type: "bill" });

      if (!billCategory) {
        return res
          .status(500)
          .json({ error: "Bill transaction category needs to be created." });
      }

      if (account.value < value) {
        return res
          .status(406)
          .json({ error: "This account dont have necessary founds." });
      }

      const transactionData = {
        title: bill.title,
        description: `Pagamento parcial da dívida: ${bill.title}`,
        category: billCategory._id,
        account: account.id,
        value,
        type: "output",
        user: userId,
        isCard,
      };

      const transaction = await Transaction.create(transactionData);

      await Account.findByIdAndUpdate(accountId, {
        value: account.value - value,
        $push: { transactions: transaction._id },
      });

      await Bill.findByIdAndUpdate(billId, {
        paidValue: bill.paidValue + value,
        remainingValue: bill.remainingValue - value,
      });

      return res.status(200).json({ message: "Bill paid successfully." });
    } catch (err) {
      return res.status(500);
    }
  },
};
