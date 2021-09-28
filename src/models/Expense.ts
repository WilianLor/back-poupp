import { Schema, model, PopulatedDoc, Document } from "mongoose";

import { UserInterface } from "./User";
import { TransactionCategoryInterface } from "./TransactionCategory";

export interface ExpenseInterface {
  user: PopulatedDoc<UserInterface & Document>;
  category: PopulatedDoc<TransactionCategoryInterface & Document>;
  value: number;
  maxValue: number;
}

const ExpenseSchema = new Schema<ExpenseInterface>({
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

const Expense = model<ExpenseInterface>("Expense", ExpenseSchema);
export default Expense;
