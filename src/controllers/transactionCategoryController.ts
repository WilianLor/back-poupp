import TransactionCategory from "../models/TransactionCategory";
import { Request, Response } from "express";

export default {
  async create(req: Request, res: Response) {
    const { name, necessary, type } = req.body;

    if (!name) {
      return res.status(400).send({ error: "The category name is required." });
    }

    if (!necessary) {
      return res
        .status(400)
        .send({ error: "The category necessary is required." });
    }

    if (!type) {
      return res.status(400).send({ error: "The category type is required." });
    }

    try {
      if (await TransactionCategory.findOne({ name })) {
        return res
          .status(400)
          .send({ error: "This category name is already in use." });
      }

      await TransactionCategory.create({
        name,
        necessary,
        type,
      });

      return res.status(201).send({ message: "Category created." });
    } catch (err) {
      return res.status(400).send({ error: "Error" + err });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const transactionCategories = await TransactionCategory.find();

      return res.status(200).send(transactionCategories);
    } catch (err) {
      return res.status(400).send({ error: "Error: " + err });
    }
  },
};
