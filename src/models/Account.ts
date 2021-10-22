import { Schema, model, PopulatedDoc, Document } from "mongoose";

import { CardInterface } from "./Card";
import { BankInterface } from "./Bank";
import { UserInterface } from "./User";
import { TransactionInterface } from "./Transaction";

export interface AccountInterface {
  username: string;
  user: PopulatedDoc<UserInterface & Document>;
  bank: PopulatedDoc<BankInterface & Document>;
  cards: PopulatedDoc<CardInterface & Document>[];
  value: number;
  transactions: PopulatedDoc<TransactionInterface & Document>[];
}

const AccountSchema = new Schema<AccountInterface>({
  username: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bank: {
    type: Schema.Types.ObjectId,
    ref: "Bank",
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: "Card",
    },
  ],
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
});

const Account = model<AccountInterface>("Account", AccountSchema);
export default Account;
