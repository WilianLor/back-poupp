import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import getParamsFromToken from "../functions/getParamsFromToken";

import FixedTransaction from "../models/FixedTransaction";
import Account from "../models/Account";
import TransactionCategory from "../models/TransactionCategory";

export default {
  async create(req: Request, res: Response) {
    const { authorization } = req.headers;
    const {
      value,
      categoryId,
      accountId,
      title,
      description,
      dueDay,
      totalOfInstallments,
    } = req.body;

    const { userId } = getParamsFromToken(authorization);

    if (!value) {
      return res
        .status(404)
        .json({ error: "The fixed transaction value is required." });
    }

    if (!title) {
      return res
        .status(404)
        .json({ error: "The fixed transaction title is required." });
    }

    if (!description) {
      return res
        .status(404)
        .json({ error: "The fixed transaction description is required." });
    }

    if (!dueDay) {
      return res
        .status(404)
        .json({ error: "The fixed transaction due day is required." });
    }

    if (!totalOfInstallments) {
      return res.status(404).json({
        error: "The fixed transaction total of installments is required.",
      });
    }

    if (!categoryId) {
      return res
        .status(404)
        .json({ error: "The fixed transaction category id is required." });
    }

    if (!isValidObjectId(categoryId)) {
      return res
        .status(404)
        .json({ error: "The fixed transaction category id is invalid." });
    }

    if (!accountId) {
      return res
        .status(404)
        .json({ error: "The fixed transaction account id is invalid." });
    }

    if (!isValidObjectId(accountId)) {
      return res
        .status(404)
        .json({ error: "The fixed transaction account id is invalid." });
    }

    if (dueDay <= 0 || dueDay > 31) {
      return res.status(406).json({ error: "" });
    }

    try {
      const account = await Account.findById(accountId);

      if (!account) {
        return res.status(406).json({ error: "This account id is invalid." });
      }

      if (account.user.toString() !== userId) {
        return res
          .status(406)
          .json({ error: "This account does not belong to you." });
      }

      const category = await TransactionCategory.findById(categoryId);

      if (!category) {
        return res.status(406).json({ error: "This category id is invalid." });
      }

      if (category.income) {
        return res
          .status(406)
          .json({ error: "This category does not is an outcome category" });
      }

      const fixedTransactionData = {
        title,
        description,
        category: categoryId,
        account: accountId,
        dueDay,
        remainingInstallments: totalOfInstallments,
        user: userId,
        value,
      };

      await FixedTransaction.create(fixedTransactionData);

      return res
        .status(201)
        .json({ message: "Fixed transaction created with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async delete(req: Request, res: Response) {
    const { authorization } = req.headers;
    const { fixedTransactionId } = req.query;

    const { userId } = getParamsFromToken(authorization);

    if (!fixedTransactionId) {
      return res
        .status(404)
        .json({ error: "The fixed transaction id is required." });
    }

    if (!isValidObjectId(fixedTransactionId)) {
      return res
        .status(406)
        .json({ error: "This fixed transaction id is invalid." });
    }

    try {
      const fixedTransaction = await FixedTransaction.findById(
        fixedTransactionId
      );

      if (!fixedTransaction) {
        return res
          .status(406)
          .json({ error: "This fixed transaction id is invalid." });
      }

      if (fixedTransaction.user.toString() !== userId) {
        return res
          .status(406)
          .json({ error: "This fixed transaction does not belong to you." });
      }

      await FixedTransaction.findByIdAndDelete(fixedTransactionId);

      return res
        .status(200)
        .json({ error: "Fixed transaction deleted with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async getAll(req: Request, res: Response) {
    const { authorization } = req.headers;
    const { limit = 10, page = 1 } = req.query;

    const { userId } = getParamsFromToken(authorization);

    try {
      const filtredFixedTransactions = await FixedTransaction.find({
        user: userId,
      }).select("-__v");

      const resultFixedTransactions = filtredFixedTransactions
        .reverse()
        .slice(
          Number(limit) * (Number(page) - 1),
          Number(limit) * Number(page)
        );

      const responseData = {
        fixedTransactions: resultFixedTransactions,
        totalOfPages: Math.ceil(
          filtredFixedTransactions.length / Number(limit)
        ),
      };

      return res.status(200).json(responseData);
    } catch (err) {
      return res.status(500);
    }
  },
};
