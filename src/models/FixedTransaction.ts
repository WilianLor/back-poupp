import { Schema, model, PopulatedDoc, Document } from "mongoose";

import { TransactionCategoryInterface } from "./TransactionCategory";
import { AccountInterface } from "./Account";
import { UserInterface } from "./User";

export interface FixedTransactionInterface {
  title: string;
  value: number;
  category: PopulatedDoc<TransactionCategoryInterface & Document>;
  account: PopulatedDoc<AccountInterface & Document>;
  description: string;
  remainingInstallments: number;
  user: PopulatedDoc<UserInterface & Document>;
  dueDay: number;
  createdAt: Date;
  updatedAt: Date;
}

const FixedTransactionSchema = new Schema<FixedTransactionInterface>(
  {
    value: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "TransactionCategory",
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    dueDay: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    remainingInstallments: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FixedTransaction = model<FixedTransactionInterface>(
  "FixedTransaction",
  FixedTransactionSchema
);
export default FixedTransaction;
