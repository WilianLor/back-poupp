import { Schema, model, PopulatedDoc, Document } from "mongoose";

import { CommentInterface } from "./Comment";
import { UserInterface } from "./User";

export interface PostInterface {
  title: string;
  image: string;
  content: string;
  author: PopulatedDoc<UserInterface & Document>;
  comments: PopulatedDoc<CommentInterface & Document>[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<PostInterface>(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = model<PostInterface>("Post", PostSchema);
export default Post;
