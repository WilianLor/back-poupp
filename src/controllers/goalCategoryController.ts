import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import GoalCategory from "../models/GoalCategory";
import Goal from "../models/Goal";

export default {
  async create(req: Request, res: Response) {
    const { name, type } = req.body;

    if (!name) {
      return res
        .status(404)
        .json({ error: "This goal category name is required." });
    }

    if (!type) {
      return res
        .status(404)
        .json({ error: "This goal category type is required." });
    }

    try {
      if (await GoalCategory.findOne({ name })) {
        return res.status(406).json({ error: "This name is already in use." });
      }

      if (await GoalCategory.findOne({ type })) {
        return res.status(406).json({ error: "This type is already in use." });
      }

      const GoalCategoryData = {
        name,
        type,
      };

      await GoalCategory.create(GoalCategoryData);

      return res
        .status(201)
        .json({ message: "Goal category was created with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async delete(req: Request, res: Response) {
    const { goalCategoryId } = req.query;

    if (!goalCategoryId) {
      return res
        .status(404)
        .json({ error: "The goal category id is required." });
    }

    if (!isValidObjectId(goalCategoryId)) {
      return res
        .status(406)
        .json({ error: "This goal category id is invalid." });
    }

    try {
      if (!(await GoalCategory.findById(goalCategoryId))) {
        return res
          .status(404)
          .json({ error: "This goal category doe snot exists." });
      }

      if (await Goal.findOne({ category: goalCategoryId })) {
        return res.status(406).json({
          error:
            "You cannot remove this goal category as there are goals linked to it.",
        });
      }

      await GoalCategory.findByIdAndDelete(goalCategoryId);

      return res
        .status(200)
        .json({ message: "Goal category removed with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const goalCategories = await GoalCategory.find().select("-__v");

      return res.status(200).json(goalCategories);
    } catch (err) {
      return res.status(500);
    }
  },
};
