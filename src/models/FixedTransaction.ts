import { Schema, model } from "mongoose";

export interface FixedTransactionInterface {
  value: string;
  category: Schema.Types.ObjectId;
  paymentMethod: Schema.Types.ObjectId;
  description: string;
  type: string;
  expirationDate: Date;
  user: Schema.Types.ObjectId;
}

const FixedTransactionSchema = new Schema<FixedTransactionInterface>({
  value: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "TransactionCategory",
    required: true,
  },
  paymentMethod: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const FixedTransaction = model<FixedTransactionInterface>(
  "FixedTransaction",
  FixedTransactionSchema
);
export default FixedTransaction;
