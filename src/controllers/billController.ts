import { Request, Response } from "express";

import Bill from "../models/Bill";

import getParamsFromToken from "../functions/getParamsFromToken";

export default {
  async create(req: Request, res: Response) {
    const { value, interest, paidValue, interestType } = req.body;
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    if (!value) {
      return res.status(404).json({ error: "The bill value is required." });
    }

    if (!interest) {
      return res
        .status(404)
        .json({ error: "The bill interest value is required." });
    }

    if (!interestType) {
      return res
        .status(404)
        .json({ error: "The bill interest type value is required." });
    }

    try {
      await Bill.create({
        value,
        interest,
        interestType,
        user: userId,
        paidValue: paidValue || 0,
      });

      return res.status(201).json({ message: "Bill created." });
    } catch (err) {
      return res.status(500);
    }
  },

  async getAll(req: Request, res: Response) {
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    try {
      const bills = await Bill.find({ user: userId });

      return res.status(200).json(bills);
    } catch (err) {
      return res.status(500);
    }
  },
};
