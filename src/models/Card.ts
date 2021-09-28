import { Schema, model, PopulatedDoc, Document } from "mongoose";

import { UserInterface } from "./User";
import { AccountInterface } from "./Account";

export interface CardInterface {
  username: string;
  limit: number;
  openDate: Date;
  closeDate: Date;
  account: PopulatedDoc<AccountInterface & Document>;
  user: PopulatedDoc<UserInterface & Document>;
}

const CardSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  openDate: {
    type: Date,
    required: true,
  },
  closeDate: {
    type: Date,
    required: true,
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Card = model("Card", CardSchema);
export default Card;
