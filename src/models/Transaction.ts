import { Schema, model, PopulatedDoc, Document } from "mongoose";

import { TransactionCategoryInterface } from "./TransactionCategory";
import { AccountInterface } from "./Account";
import { UserInterface } from "./User";

export interface TransactionInterface {
  title: string;
  description: string;
  category: PopulatedDoc<TransactionCategoryInterface & Document>;
  account: PopulatedDoc<AccountInterface & Document>;
  user: PopulatedDoc<UserInterface & Document>;
  transferAccount: PopulatedDoc<AccountInterface & Document>;
  isCard: boolean;
  value: number;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<TransactionInterface>(
  {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "TransactionCategory",
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
    transferAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    isCard: {
      type: Boolean,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = model<TransactionInterface>(
  "Transaction",
  TransactionSchema
);
export default Transaction;
