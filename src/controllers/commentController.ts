import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import Comment from "../models/Comment";
import Post from "../models/Post";

import getParamsFromToken from "../utils/getParamsFromToken";

export default {
  async create(req: Request, res: Response) {
    const { content, postId } = req.body;
    const { authorization } = req.headers;

    const { userId } = getParamsFromToken(authorization);

    if (!isValidObjectId(postId)) {
      return res.status(404).json({ error: "This post id is invalid." });
    }

    try {
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ error: "This post id is invalid." });
      }

      if (!content) {
        return res
          .status(404)
          .json({ error: "The comment content is required." });
      }

      const commentData = {
        author: userId,
        post: post._id,
        content,
      };

      const comment = await Comment.create(commentData);

      await Post.findByIdAndUpdate(postId, {
        $push: { comments: comment._id },
      });

      return res.status(201).json(comment);
    } catch (err) {
      return res.status(500);
    }
  },

  async delete(req: Request, res: Response) {
    const { commentId } = req.query;

    if (!isValidObjectId(commentId)) {
      return res.status(404).json({ error: "This comment id is invalid." });
    }

    try {
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(406).json({ error: "This comment id is invalid." });
      }

      await Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: comment._id },
      });

      await Comment.findByIdAndRemove(commentId);

      return res.status(200).json({ message: "Comment removed with success." });
    } catch (err) {
      return res.status(500);
    }
  },
};
