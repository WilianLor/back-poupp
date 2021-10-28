import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import getParamsFromToken from "../functions/getParamsFromToken";

import TransactionCategory from "../models/TransactionCategory";
import Expense from "../models/Expense";

export default {
  async create(req: Request, res: Response) {
    const { transactionCategoryId, value = 0, maxValue } = req.body;
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    if (!transactionCategoryId) {
      return res
        .status(404)
        .json({ error: "The transaction category id is required." });
    }

    if (!maxValue) {
      return res
        .status(404)
        .json({ error: "The expense max value is required." });
    }

    if (!isValidObjectId(transactionCategoryId)) {
      return res
        .status(406)
        .json({ error: "This transaction category id is invalid." });
    }

    try {
      if (
        !(await TransactionCategory.find({
          _id: transactionCategoryId,
          income: false,
        }))
      ) {
        return res
          .status(406)
          .json({ error: "This transaction category id is invalid." });
      }

      if (
        await Expense.findOne({ category: transactionCategoryId, user: userId })
      ) {
        return res.status(406).json({
          error:
            "This user already have an expense with this transaction category.",
        });
      }

      const expenseData = {
        user: userId,
        maxValue,
        value,
        category: transactionCategoryId,
      };

      await Expense.create(expenseData);

      return res.status(201).json({ message: "Expense create with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async delete(req: Request, res: Response) {
    const { expenseId } = req.query;
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    if (!expenseId) {
      return res.status(404).json({ error: "The expense id is required." });
    }

    if (!isValidObjectId(expenseId)) {
      return res.status(406).json({ error: "This expense id is invalid." });
    }

    try {
      const expense = await Expense.findById(expenseId);

      if (!expense) {
        return res.status(406).json({ error: "This expense id is invalid." });
      }

      if (expense.user.toString() !== userId) {
        return res
          .status(406)
          .json({ error: "This expense does not belong to you." });
      }

      await Expense.findByIdAndDelete(expenseId);

      return res.status(200).json({ message: "Expense deleted with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async getAll(req: Request, res: Response) {
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    try {
      const expenses = await Expense.find({ user: userId }).select("-__v");

      return res.status(200).json(expenses);
    } catch (err) {
      return res.status(5000);
    }
  },
};
