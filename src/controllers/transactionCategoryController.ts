import TransactionCategory from "../models/TransactionCategory";
import { Request, Response } from "express";

export default {
  async create(req: Request, res: Response) {
    const { name, necessary, type } = req.body;

    if (!name) {
      return res.status(404).json({ error: "The category name is required." });
    }

    if (!necessary) {
      return res
        .status(404)
        .json({ error: "The category necessary is required." });
    }

    if (!type) {
      return res.status(404).json({ error: "The category type is required." });
    }

    try {
      if (await TransactionCategory.findOne({ name })) {
        return res
          .status(406)
          .json({ error: "This category name is already in use." });
      }

      await TransactionCategory.create({
        name,
        necessary,
        type,
      });

      return res.status(201).json({ message: "Category created." });
    } catch (err) {
      return res.status(500);
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const transactionCategories = await TransactionCategory.find();

      return res.status(200).json(transactionCategories);
    } catch (err) {
      return res.status(500);
    }
  },
};
