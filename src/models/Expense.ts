import { Schema, model } from "mongoose";

const ExpenseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "TransactionCategory",
    required: true,
  },
  value: {
    type: Number,
    default: 0,
  },
  maxValue: {
    type: Number,
    required: true,
  },
});

const Expense = model("Expense", ExpenseSchema);
export default Expense;
