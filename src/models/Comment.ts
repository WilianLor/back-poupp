import { Schema, model } from "mongoose";

export interface CommentInterface {
  user: Schema.Types.ObjectId;
  content: string;
  post: Schema.Types.ObjectId;
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
