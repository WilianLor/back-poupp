import { Schema, model, PopulatedDoc, Document } from "mongoose";

import { UserInterface } from "./User";
import { PostInterface } from "./Post";

export interface CommentInterface {
  user: PopulatedDoc<UserInterface & Document>;
  content: string;
  post: PopulatedDoc<PostInterface & Document>;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<CommentInterface>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = model<CommentInterface>("Comment", CommentSchema);
export default Comment;
