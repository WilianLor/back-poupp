import { Schema, model } from "mongoose";

const TransactionCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  necessary: {
    type: Number,
    required: true,
  },
  pictureUrl: {
    type: String,
    required: true,
  },
});

const TransactionCategory = model(
  "TransactionCategory",
  TransactionCategorySchema
);
export default TransactionCategory;
