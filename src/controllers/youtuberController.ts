import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import Youtuber from "../models/Youtuber";

export default {
  async create(req: Request, res: Response) {
    const { channelId, title, picture } = req.body;

    if (!channelId) {
      return res
        .status(404)
        .json({ error: "The youtuber picture is required." });
    }

    if (!title) {
      return res.status(404).json({ error: "The youtuber title is required." });
    }

    if (!picture) {
      return res.status(404).json({ error: "The user picture is required." });
    }

    try {
      await Youtuber.create({
        channelId,
        title,
        picture,
      });

      return res
        .status(201)
        .json({ message: "Youtuber created with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const youtubers = await Youtuber.find().select("-__v");

      return res.status(200).json(youtubers);
    } catch (err) {
      return res.status(500);
    }
  },

  async delete(req: Request, res: Response) {
    const { youtuberId } = req.query;

    if (!youtuberId) {
      return res.status(404).json({ error: "The youtuber id is required." });
    }

    if (!isValidObjectId(youtuberId)) {
      return res.status(406).json({ error: "This youtuber id is required." });
    }

    try {
      if (!(await Youtuber.findById(youtuberId))) {
        return res
          .status(404)
          .json({ error: "This youtuber does not exists." });
      }

      await Youtuber.findByIdAndDelete(youtuberId);

      return res
        .status(200)
        .json({ message: "Youtuber deleted with success." });
    } catch (error) {
      return res.status(500);
    }
  },
};
