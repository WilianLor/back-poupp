import { Schema, model } from "mongoose";

const FixedTransactionSchema = new Schema({
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

const FixedTransaction = model("FixedTransaction", FixedTransactionSchema);
export default FixedTransaction;
