import Post from "../models/Post";
import Comment from "../models/Comment";
import getParamsFromToken from "../functions/getParamsFromToken";
import { Request, Response } from "express";

export default {
  async create(req: Request, res: Response) {
    const { title, image, content, topic } = req.body;
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    try {
      if (!title) {
        return res.status(404).json({ error: "An post needs to an title." });
      }

      if (!content) {
        return res.status(404).json({ error: "An post needs to an content." });
      }

      if (topic !== "extraincome" && topic !== "pouppeducate") {
        return res.status(406).json({ error: "This post topic is invalid" });
      }

      const postData = {
        title,
        image,
        content,
        topic,
        author: userId,
      };

      await Post.create(postData);

      return res.status(201).json({ message: "Post created with success." });
    } catch (err) {
      return res.status(500);
    }
  },

  async getAll(req: Request, res: Response) {
    const { topic } = req.query;

    try {
      if (topic !== "extraincome" && topic !== "pouppeducate") {
        return res.status(406).json({ error: "This post topic is invalid" });
      }

      const posts = await Post.find({ topic }).select([
        "-author",
        "-comments",
        "-topic",
        "-content",
        "-__v",
        "-updatedAt",
      ]);

      return res.status(200).json(posts);
    } catch (err) {
      return res.status(500);
    }
  },

  async getOne(req: Request, res: Response) {
    const { postId } = req.query;

    try {
      const post = await await Post.findById(postId)
        .populate(["author", "comments"])
        .select("-__v");

      if (!post) {
        return res.status(404).json({ error: "This post id is invalid." });
      }

      return res.status(200).json(post);
    } catch (err) {
      return res.status(500);
    }
  },

  async delete(req: Request, res: Response) {
    const { postId } = req.query;

    try {
      await Post.findByIdAndDelete(postId);
      await Comment.deleteMany({ post: postId });

      return res.status(200).json({ message: "Post removed with success." });
    } catch (err) {
      return res.status(500);
    }
  },
};
