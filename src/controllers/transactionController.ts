import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import getParamsFromToken from "../functions/getParamsFromToken";

import TransactionCategory from "../models/TransactionCategory";
import Transaction from "../models/Transaction";
import Account from "../models/Account";
import Card from "../models/Card";

export default {
  async create(req: Request, res: Response) {
    const { authorization } = req.headers;
    const { type, title, description, categoryId, accountId, value } = req.body;

    const { userId } = getParamsFromToken(authorization);

    if (!value) {
      return res
        .status(404)
        .json({ error: "The transaction value is required." });
    }

    if (value <= 0) {
      return res
        .status(406)
        .json({ error: "The transaction value cannot be less than 0." });
    }

    if (!title) {
      return res
        .status(404)
        .json({ error: "The transaction title is required." });
    }

    if (!description) {
      return res
        .status(404)
        .json({ error: "The transaction description is required." });
    }

    if (!type) {
      return res
        .status(404)
        .json({ error: "The transaction type is required." });
    }

    if (!accountId) {
      return res.status(404).json({ error: "The account id required." });
    }

    if (!isValidObjectId(accountId)) {
      return res.status(406).json({ error: "This account id is invalid." });
    }

    const account = await Account.findById(accountId).populate("card");

    if (!account) {
      return res.status(406).json({ error: "This account id is invalid." });
    }

    if (account.user.toString() !== userId) {
      return res
        .status(406)
        .json({ error: "This account does not belong to you." });
    }

    switch (type) {
      case "income":
        if (!categoryId) {
          return res
            .status(404)
            .json({ error: "The transaction category is required." });
        }

        if (!isValidObjectId(categoryId)) {
          return res
            .status(406)
            .json({ error: "This category id is invalid." });
        }

        const incomeCategory = await TransactionCategory.findById(categoryId);

        if (!incomeCategory) {
          return res
            .status(406)
            .json({ error: "This category id is invalid." });
        }

        if (!incomeCategory.income) {
          return res
            .status(406)
            .json({ error: "This category does not is an income category." });
        }

        const incomeTransactionData = {
          user: userId,
          account: accountId,
          description,
          title,
          category: categoryId,
          type: "income",
          value,
        };

        const incomeTransaction = await Transaction.create(
          incomeTransactionData
        );

        await Account.findByIdAndUpdate(accountId, {
          $push: { transactions: incomeTransaction.id },
          value: account.value + value,
        });

        return res
          .status(201)
          .json({ message: "Transaction created with success." });
      case "output":
        const { isCard } = req.body;

        if (!categoryId) {
          return res
            .status(404)
            .json({ error: "The transaction category is required." });
        }

        if (!isValidObjectId(categoryId)) {
          return res
            .status(406)
            .json({ error: "This category id is invalid." });
        }

        const outputCategory = await TransactionCategory.findById(categoryId);

        if (!outputCategory) {
          return res
            .status(406)
            .json({ error: "This category id is invalid." });
        }

        if (outputCategory.income) {
          return res
            .status(406)
            .json({ error: "This category does not is an output category." });
        }

        if (!account.card && isCard) {
          return res
            .status(406)
            .json({ error: "This account does not have a card." });
        }

        if (isCard && account.card.value + value > account.card.limit) {
          return res.status(406).json({ error: "You can't max out your card" });
        }

        const outputTransactionData = {
          user: userId,
          category: categoryId,
          account: accountId,
          type: "output",
          title,
          isCard,
          description,
          value,
        };

        const outputTransaction = await Transaction.create(
          outputTransactionData
        );

        if (isCard) {
          await Account.findByIdAndUpdate(accountId, {
            $push: { transactions: outputTransaction.id },
          });
          await Card.findByIdAndUpdate(account.card._id, {
            value: account.card.value + value,
          });
        } else {
          await Account.findByIdAndUpdate(accountId, {
            $push: { transactions: outputTransaction.id },
            value: account.value - value,
          });
        }

        return res
          .status(201)
          .json({ message: "Transaction created with success." });
      case "transfer":
        const { transferAccountId } = req.body;

        if (!transferAccountId) {
          return res
            .status(404)
            .json({ error: "The transfer account id is required." });
        }

        if (!isValidObjectId(transferAccountId)) {
          return res
            .status(406)
            .json({ error: "This transfer account id is invalid." });
        }

        const transferAccount = await Account.findById(transferAccountId);

        if (!transferAccount) {
          return res
            .status(404)
            .json({ error: "This account does not exists." });
        }

        if (transferAccount.user.toString() !== userId) {
          return res
            .status(406)
            .json({ error: "This transfer account does not belong to you." });
        }

        const transferTransactionData = {
          user: userId,
          account: accountId,
          transferAccount: transferAccountId,
          description,
          title,
          value,
          type: "transfer",
        };

        const transferTransaction = await Transaction.create(
          transferTransactionData
        );

        await Account.findByIdAndUpdate(accountId, {
          value: account.value - value,
          $push: { transactions: transferTransaction._id },
        });

        await Account.findByIdAndUpdate(transferAccountId, {
          value: transferAccount.value + value,
          $push: { transactions: transferTransaction._id },
        });

        return res
          .status(201)
          .json({ message: "Transaction created with success." });
      default:
        return res
          .status(406)
          .json({ error: "This transaction type is invalid." });
    }
  },

  async getMonthTransactions(req: Request, res: Response) {
    const { authorization } = req.headers;

    const {
      month,
      year,
      limit = 10,
      page = 1,
    } = req.query;

    const { userId } = getParamsFromToken(authorization);

    if (Number(month) > 11 && Number(month) < 0) {
      return res.status(406).json({ error: "Month goes from 0 to 11" });
    }

    try {
      const transactions = await Transaction.find({ user: userId });

      const filtredTransactions = transactions.filter(
        (transaction) =>
          transaction.createdAt.getMonth() === Number(month) &&
          transaction.createdAt.getFullYear() === Number(year)
      );

      const resultTransactions = filtredTransactions
        .reverse()
        .slice(
          Number(limit) * (Number(page) - 1),
          Number(limit) * Number(page)
        );

      const responseData = {
        transactions: resultTransactions,
        totalOfPages: Math.ceil(filtredTransactions.length / Number(limit)),
      };

      return res.status(200).json(responseData);
    } catch (err) {
      return res.status(500);
    }
  },

  async getLastsTransactions(req: Request, res: Response) {
    const { authorization } = req.headers;
    const { limit = 3 } = req.query;

    const { userId } = getParamsFromToken(authorization);

    try {
      const transactions = await Transaction.find({ user: userId });

      if (transactions.length <= Number(limit)) {
        const responseTransactions = transactions.reverse();

        return res.status(200).json(responseTransactions);
      } else {
        const responseTransactions = transactions
          .reverse()
          .slice(0, Number(limit));

        return res.status(200).json(responseTransactions);
      }
    } catch (err) {
      return res.status(500);
    }
  },
};
