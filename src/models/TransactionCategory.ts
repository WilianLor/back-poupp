import { Schema, model } from "mongoose";

export interface TransactionCategoryInterface {
  name: string;
  necessary: number;
  type: string;
}

const TransactionCategorySchema = new Schema<TransactionCategoryInterface>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  necessary: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const TransactionCategory = model<TransactionCategoryInterface>(
  "TransactionCategory",
  TransactionCategorySchema
);
export default TransactionCategory;
