import { isValidObjectId } from "mongoose";
import { Request, Response } from "express";

import TransactionCategory from "../models/TransactionCategory";
import Transaction from "../models/Transaction";
import Expense from "../models/Expense";

export default {
  async create(req: Request, res: Response) {
    const { name, necessary, type, income } = req.body;

    if (income === undefined) {
      return res
        .status(404)
        .json({ error: "The category income is required." });
    }

    if (!name) {
      return res.status(404).json({ error: "The category name is required." });
    }

    if (!type) {
      return res.status(404).json({ error: "The category type is required." });
    }

    if (!necessary) {
      if (type !== "bill" && type !== "goal" && type !== "extraIncome") {
        return res
          .status(404)
          .json({ error: "The category necessary is required." });
      }
    } else {
      if (type === "bill" || type === "goal" || type === "extraIncome") {
        return res
          .status(404)
          .json({ error: "This category cannot have necessary." });
      }
    }

    try {
      if (await TransactionCategory.findOne({ name })) {
        return res
          .status(406)
          .json({ error: "This category name is already in use." });
      }

      if (type === "goal" || type === "bill" || type === "extraIncome") {
        if (await TransactionCategory.findOne({ type })) {
          return res
            .status(406)
            .json({ error: "This transaction category type already exists." });
        }

        await TransactionCategory.create({
          name,
          type,
          income,
        });
      } else {
        await TransactionCategory.create({
          name,
          necessary,
          type,
          income,
        });
      }

      return res.status(201).json({ message: "Category created." });
    } catch (err) {
      return res.status(500);
    }
  },

  async delete(req: Request, res: Response) {
    const { transactionCategoryId } = req.query;

    if (!transactionCategoryId) {
      return res
        .status(404)
        .json({ error: "The transaction category name id is required." });
    }

    if (!isValidObjectId(transactionCategoryId)) {
      return res
        .status(406)
        .json({ error: "This transaction category id is invalid." });
    }

    try {
      if (!(await TransactionCategory.findById(transactionCategoryId))) {
        return res
          .status(404)
          .json({ error: "This transaction category does not exists." });
      }

      if (await Transaction.findOne({ category: transactionCategoryId })) {
        return res.status(406).json({
          error:
            "You cannot remove this transaction category as there are transactions linked to it.",
        });
      }

      if (await Expense.findOne({ category: transactionCategoryId })) {
        return res.status(406).json({
          error:
            "You cannot remove this transaction category as there are expenses linked to it.",
        });
      }

      await TransactionCategory.findByIdAndDelete(transactionCategoryId);

      return res
        .status(200)
        .json({ message: "Transaction category removed with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const transactionCategories = await TransactionCategory.find();

      const filtredCategories = transactionCategories.filter(
        (category) => category.necessary
      );

      return res.status(200).json(filtredCategories);
    } catch (err) {
      return res.status(500);
    }
  },
};
