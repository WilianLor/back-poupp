import { Schema, model, PopulatedDoc, Document } from "mongoose";

import { UserInterface } from "./User";
import { AccountInterface } from "./Account";
import { BankInterface } from "./Bank";
import { TransactionInterface } from "./Transaction";

export interface CardInterface {
  limit: number;
  closeDay: number;
  account: PopulatedDoc<AccountInterface & Document>;
  user: PopulatedDoc<UserInterface & Document>;
  bank: PopulatedDoc<BankInterface & Document>;
  value: number;
  username: string;
  transactions: PopulatedDoc<TransactionInterface & Document>[];
}

const CardSchema = new Schema<CardInterface>({
  username: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    required: true,
  },
  bank: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Bank",
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
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
});

const Card = model<CardInterface>("Card", CardSchema);
export default Card;
