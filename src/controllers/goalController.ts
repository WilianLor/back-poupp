import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import getParamsFromToken from "../functions/getParamsFromToken";

import Goal from "../models/Goal";
import GoalCategory from "../models/GoalCategory";
import Account from "../models/Account";
import Transaction from "../models/Transaction";
import TransactionCategory from "../models/TransactionCategory";

export default {
  async create(req: Request, res: Response) {
    const { title, totalValue, expirationDate, goalCategoryId } = req.body;

    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    if (!goalCategoryId) {
      return res.status(404).json({ error: "The goal category is required." });
    }

    if (!isValidObjectId(goalCategoryId)) {
      console.log("goal category")
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

    if (!title) {
      return res.status(404).json({ error: "The goal title is required." });
    }

    const expirationDateFormated = new Date(expirationDate);

    if (expirationDateFormated < new Date(Date.now())) {
      console.log("goal expiration date")
      return res
        .status(406)
        .json({ error: "This expiration date is invalid." });
    }

    try {
      if (await Goal.findOne({ title })) {
        console.log("goal title")
        return res
          .status(406)
          .json({ error: "This goal name is already in use." });
      }

      if (!(await GoalCategory.findById(goalCategoryId))) {
        console.log("goal categoryId")
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
      const goals = await Goal.find({ user: userId })
        .populate("category")
        .select("-__v");

      const goalAccount = await Account.findOne({ user: userId, type: "goal" });

      if (!goalAccount) {
        return res.status(404).json({ error: "Make your initial config." });
      }

      const responseData = {
        reservedToGoals: goalAccount.value,
        goals,
      };

      return res.status(200).json(responseData);
    } catch (err) {
      return res.status(500);
    }
  },

  async complete(req: Request, res: Response) {
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
        return res.status(404).json({ error: "This goal id is invalid." });
      }

      if (goal.user.toString() !== userId) {
        return res
          .status(406)
          .json({ error: "This goals does not belong to you." });
      }

      const goalAccount = await Account.findOne({ user: userId, type: "goal" });

      if (!goalAccount) {
        return res
          .status(404)
          .json({ error: "Do your initial configuration before." });
      }

      if (goalAccount.value < goal.totalValue) {
        return res.status(406).json({
          error:
            "You dont have money to complete this goal, Add more to your goal account.",
        });
      }

      const goalTransactionCategory = await TransactionCategory.findOne({
        type: "goal",
      });

      if (!goalTransactionCategory) {
        return res
          .status(500)
          .json({ error: "Goal transaction category needs to be created." });
      }

      const transactionData = {
        title: goal.title,
        value: goal.totalValue,
        description: `Conclusão da meta: ${goal.title}.`,
        category: goalTransactionCategory._id,
        account: goalAccount._id,
        user: userId,
        type: "outcome",
      };

      const transaction = await Transaction.create(transactionData);

      await Goal.findByIdAndDelete(goal._id);

      await Account.findByIdAndUpdate(goalAccount._id, {
        value: goalAccount.value - goal.totalValue,
        $push: { transactions: transaction._id },
      });

      return res.status(200).json({ message: "This goal is now completed." });
    } catch (err) {
      return res.status(500);
    }
  },
};
