import { Schema, model, PopulatedDoc, Document } from "mongoose";

import { CardInterface } from "./Card";
import { BankInterface } from "./Bank";
import { UserInterface } from "./User";
import { TransactionInterface } from "./Transaction";

export interface AccountInterface {
  name: string;
  user: PopulatedDoc<UserInterface & Document>;
  bank: PopulatedDoc<BankInterface & Document>;
  card?: PopulatedDoc<CardInterface & Document>;
  value: number;
  transactions: PopulatedDoc<TransactionInterface & Document>[];
  type: string;
}

const AccountSchema = new Schema<AccountInterface>({
  name: {
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
  },
  value: {
    type: Number,
    default: 0,
    required: true,
  },
  card: {
    type: Schema.Types.ObjectId,
    ref: "Card",
  },
  type: {
    type: String,
    required: true,
    default: "normal",
  },
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
});

const Account = model<AccountInterface>("Account", AccountSchema);
export default Account;
