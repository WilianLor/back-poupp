import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import getParamsFromToken from "../functions/getParamsFromToken";

import ExtraIncomeCategory from "../models/ExtraIncomeCategory";
import ExtraIncomeGoal from "../models/ExtraIncomeGoals";

export default {
  async create(req: Request, res: Response) {
    const {
      title,
      extraIncomeCategory,
      totalValue,
      reachedValue = 0,
    } = req.body;

    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    if (!title) {
      return res
        .status(404)
        .json({ error: "The extra income title is required." });
    }

    if (!totalValue) {
      return res
        .status(404)
        .json({ error: "The extra income goal total value is required." });
    }

    if (totalValue < reachedValue) {
      return res.status(406).json({
        error: "The total value cannot be less than the reached value.",
      });
    }

    if (!extraIncomeCategory) {
      return res
        .status(404)
        .json({ error: "The extra income goal category id is required." });
    }

    if (!isValidObjectId(extraIncomeCategory)) {
      return res
        .status(404)
        .json({ error: "The extra income goal category id is required." });
    }

    try {
      if (!(await ExtraIncomeCategory.findById(extraIncomeCategory))) {
        return res
          .status(404)
          .json({ error: "The extra income category not founded." });
      }

      const extraIncomeGoalData = {
        title,
        category: extraIncomeCategory,
        reachedValue,
        totalValue,
        user: userId,
      };

      await ExtraIncomeGoal.create(extraIncomeGoalData);

      return res
        .status(201)
        .json({ message: "Extra income goal created with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async delete(req: Request, res: Response) {
    const { extraIncomeGoalId } = req.query;
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    if (!extraIncomeGoalId) {
      return res
        .status(404)
        .json({ error: "The extra income goal id is required." });
    }

    if (!isValidObjectId(extraIncomeGoalId)) {
      return res
        .status(406)
        .json({ error: "This extra income goal id is invalid" });
    }

    try {
      const extraIncomeGoal = await ExtraIncomeGoal.findById(extraIncomeGoalId);

      if (!extraIncomeGoal) {
        return res
          .status(406)
          .json({ error: "This extra income goal does not exists." });
      }

      if (extraIncomeGoal.user.toString() !== userId) {
        return res
          .status(406)
          .json({ error: "This extra income goal doesn't belong to you." });
      }

      await ExtraIncomeGoal.findByIdAndDelete(extraIncomeGoalId);

      return res
        .status(200)
        .json({ message: "Extra income goal create with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async getAll(req: Request, res: Response) {
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    try {
      const extraIncomeGoals = await ExtraIncomeGoal.find({
        user: userId,
      }).select("-__v");

      return res.status(200).json(extraIncomeGoals);
    } catch (err) {
      return res.status(500);
    }
  },
};
