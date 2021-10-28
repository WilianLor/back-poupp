import { Schema, model, PopulatedDoc, Document } from "mongoose";

import { UserInterface } from "./User";
import { AccountInterface } from "./Account";

export interface CardInterface {
  limit: number;
  closeDay: number;
  account: PopulatedDoc<AccountInterface & Document>;
  user: PopulatedDoc<UserInterface & Document>;
  value: number;
}

const CardSchema = new Schema<CardInterface>({
  value: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    required: true,
  },
  closeDay: {
    type: Number,
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

const Card = model<CardInterface>("Card", CardSchema);
export default Card;
