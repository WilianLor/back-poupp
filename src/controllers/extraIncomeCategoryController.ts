import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import ExtraIncomeCategory from "../models/ExtraIncomeCategory";
import ExtraIncomeGoal from "../models/ExtraIncomeGoals";

export default {
  async create(req: Request, res: Response) {
    const { name, type, image } = req.body;

    if (!name) {
      return res
        .status(404)
        .json({ error: "The extra income category name is required." });
    }

    if (!type) {
      return res
        .status(404)
        .json({ error: "The extra income category type is required." });
    }

    if (!image) {
      return res
        .status(404)
        .json({ error: "The extra income category image is required." });
    }

    try {
      if (await ExtraIncomeCategory.findOne({ name })) {
        return res.status(406).json({ error: "This name is already in use." });
      }

      if (await ExtraIncomeCategory.findOne({ type })) {
        return res.status(406).json({ error: "This type is already in use." });
      }

      const extraIncomeCategoryData = {
        name,
        type,
        image
      };

      await ExtraIncomeCategory.create(extraIncomeCategoryData);

      return res
        .status(201)
        .json({ message: "Extra income category created with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async delete(req: Request, res: Response) {
    const { extraIncomeCategoryId } = req.query;

    if (!extraIncomeCategoryId) {
      return res
        .status(404)
        .json({ error: "The extra income category is required." });
    }

    if (!isValidObjectId(extraIncomeCategoryId)) {
      return res
        .status(406)
        .json({ error: "This extra income category is invalid." });
    }

    try {
      if (!(await ExtraIncomeCategory.findById(extraIncomeCategoryId))) {
        return res
          .status(404)
          .json({ error: "Extra income category not founded." });
      }

      if (await ExtraIncomeGoal.findOne({ category: extraIncomeCategoryId })) {
        return res.status(406).json({
          error:
            "You cannot remove this extra income category as there are extra income goals linked to it.",
        });
      }

      await ExtraIncomeCategory.findByIdAndDelete(extraIncomeCategoryId);

      return res
        .status(200)
        .json({ message: "Extra income category was removed with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const ExtraIncomeCategories = await ExtraIncomeCategory.find().select(
        "-__v"
      );

      return res.status(200).json(ExtraIncomeCategories);
    } catch (err) {
      return res.status(500);
    }
  },
};
