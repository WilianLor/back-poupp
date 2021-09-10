import { Request, Response } from "express";

import Bill from "../models/Bill";
import User from "../models/User";

import getUserIdFromToken from "../functions/getUserIdFromToken";

interface Data {
  userId: string;
}

export default {
  async create(req: Request, res: Response) {
    const { value, interest, paidValue, interestType } = req.body;
    const { authorization } = req.headers;

    const { userId } = getUserIdFromToken(authorization);

    if (!userId) {
      return res.status(400).send({ error: "This user id is invalid." });
    }

    if (!value) {
      return res.status(400).send({ error: "The bill value is required." });
    }

    if (!interest) {
      return res
        .status(400)
        .send({ error: "The bill interest value is required." });
    }

    if (!interestType) {
      return res
        .status(400)
        .send({ error: "The bill interest type value is required." });
    }

    try {
      if (!(await User.findById(userId))) {
        return res.status(400).send({ error: "This user id is invalid." });
      }

      await Bill.create({
        value,
        interest,
        interestType,
        user: userId,
        paidValue: paidValue || 0,
      });

      return res.status(201).send({ message: "Bill created." });
    } catch (err) {
      return res.status(400).send({ error: "Error: " + err });
    }
  },

  async getAll(req: Request, res: Response) {
    const { authorization } = req.headers;

    const { userId } = getUserIdFromToken(authorization);

    try {
      if (!(await User.findById(userId))) {
        return res.status(400).send({ error: "This user id is invalid." });
      }

      const bills = await Bill.find({ user: userId });

      return res.status(200).send(bills);
    } catch (err) {
      return res.status(400).send({ error: "Error: " + err });
    }
  },
};
