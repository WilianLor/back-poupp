import { Response, Request } from "express";
import { isValidObjectId } from "mongoose";
import getParamsFromToken from "../functions/getParamsFromToken";

import Card from "../models/Card";
import Account from "../models/Account";

export default {
  async create(req: Request, res: Response) {
    const { limit, accountId, closeDay, username } = req.body;
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    if (!username) {
      return res.status(404).json({
        error: "The card username is required.",
      });
    }

    if (!limit) {
      return res
        .status(404)
        .json({ error: "The card credit limit is required." });
    }

    if (!accountId) {
      return res
        .status(404)
        .json({ error: "The card account id is required." });
    }

    if (!isValidObjectId(accountId)) {
      return res
        .status(406)
        .json({ error: "The card account id is required." });
    }

    if (!closeDay) {
      return res
        .status(404)
        .json({ error: "The card close date is required." });
    }

    try {
      const account = await Account.findById(accountId).populate("bank");

      if (!account) {
        return res.status(406).json({ error: "This account does not exists." });
      }

      if (account.type !== "normal") {
        return res
          .status(406)
          .json({ error: "This account cannot have a card." });
      }

      if (account.user.toString() !== userId) {
        return res
          .status(406)
          .json({ error: "This account does not belong to you." });
      }

      if (account.card) {
        return res
          .status(406)
          .json({ error: "This account already has an card." });
      }

      const cardData = {
        username,
        user: userId,
        account: accountId,
        limit,
        closeDay,
        bank: account.bank._id,
      };

      const card = await Card.create(cardData);

      await Account.findByIdAndUpdate(accountId, {
        card: card._id,
      });

      return res.status(201).json({ message: "Card created with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async getAll(req: Request, res: Response) {
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    try {
      const cards = await Card.find({ user: userId }).populate(["account", "bank", "transactions"]);

      return res.status(200).json(cards);
    } catch (err) {
      return res.status(500);
    }
  },

  async getTransactions(req: Request, res: Response) {
    const { cardId, page = 1, limit = 10 } = req.query;

    if (!cardId) {
      return res.status(404).json({ error: "The card id is required;" });
    }

    if (!isValidObjectId(cardId)) {
      return res.status(406).json({ error: "This card id is invalid." });
    }

    try {
      const card = await Card.findById(cardId);

      if (!card) {
        return res.status(406).json({ error: "This card does not exists." });
      }

      const { transactions } = await Account.findById(card.account).populate(
        "transactions"
      );

      const filtredTransactions = transactions.filter(
        (transaction) => transaction.isCard
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
};
