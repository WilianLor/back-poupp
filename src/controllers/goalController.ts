import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import getParamsFromToken from "../functions/getParamsFromToken";

import Goal from "../models/Goal";
import GoalCategory from "../models/GoalCategory";

export default {
  async create(req: Request, res: Response) {
    const {
      title,
      totalValue,
      reachedValue = 0,
      expirationDate,
      goalCategoryId,
    } = req.body;

    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    if (!goalCategoryId) {
      return res.status(404).json({ error: "The goal category is required." });
    }

    if (!isValidObjectId(goalCategoryId)) {
      return res
        .status(406)
        .json({ error: "This goal category id is invalid." });
    }

    if (!expirationDate) {
      return res
        .status(404)
        .json({ error: "The goal expiration date is required." });
    }

    if (!totalValue) {
      return res
        .status(404)
        .json({ error: "The goal total value is required." });
    }

    if (totalValue < reachedValue) {
      return res.status(406).json({
        error: "The goal total value cannot be less than reached value.",
      });
    }

    if (!title) {
      return res.status(404).json({ error: "The goal title is required." });
    }

    const expirationDateFormated = new Date(expirationDate);

    if (expirationDateFormated < new Date(Date.now())) {
      return res
        .status(406)
        .json({ error: "This expiration date is invalid." });
    }

    try {
      if (await Goal.findOne({ title })) {
        return res
          .status(406)
          .json({ error: "This goal name is already in use." });
      }

      if (!(await GoalCategory.findById(goalCategoryId))) {
        return res
          .status(406)
          .json({ error: "This goal category id is invalid." });
      }

      const goalData = {
        title,
        user: userId,
        expirationDate: expirationDateFormated,
        category: goalCategoryId,
        totalValue,
        reachedValue,
      };

      await Goal.create(goalData);

      return res.status(201).json({ message: "Goal created with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async delete(req: Request, res: Response) {
    const { goalId } = req.query;
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    if (!goalId) {
      return res.status(404).json({ error: "The goal id is required." });
    }

    if (!isValidObjectId(goalId)) {
      return res.status(406).json({ error: "This goal id is invalid." });
    }

    try {
      const goal = await Goal.findById(goalId);

      if (!goal) {
        return res.status(406).json({ error: "This goal id is invalid." });
      }

      if (goal.user.toString() !== userId) {
        return res
          .status(406)
          .json({ error: "This goal does not belong to you." });
      }

      await Goal.findByIdAndDelete(goalId);

      return res.status(200).json({ message: "Goal deleted with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async getAll(req: Request, res: Response) {
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    try {
      const goals = await Goal.find({ user: userId }).select("-__v");

      return res.status(200).json(goals);
    } catch (err) {
      return res.status(500);
    }
  },
};
