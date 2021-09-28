import { Schema, model, PopulatedDoc, Document } from "mongoose";

import { TransactionCategoryInterface } from "./TransactionCategory";
import { AccountInterface } from "./Account";
import { UserInterface } from "./User";

export interface FixedTransactionInterface {
  value: string;
  category: PopulatedDoc<TransactionCategoryInterface & Document>;
  paymentMethod: PopulatedDoc<AccountInterface & Document>;
  description: string;
  type: string;
  expirationDate: Date;
  user: PopulatedDoc<UserInterface & Document>;
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
