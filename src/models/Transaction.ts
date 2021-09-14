import { Schema, model } from "mongoose";

export interface TransactionInterface {
  title: string;
  description: string;
  category: Schema.Types.ObjectId;
  account: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  transferAccount: Schema.Types.ObjectId;
  isCard: boolean;
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
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
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
    transferAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    isCard: {
      type: Boolean,
      required: true,
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
