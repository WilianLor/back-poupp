import { Schema, model, PopulatedDoc, Document } from "mongoose";

import { UserInterface } from "./User";
import { ExtraIncomeCategoryInterface } from "./ExtraIncomeCategory";

export interface ExtraIncomeGoalInterface {
  title: string;
  user: PopulatedDoc<UserInterface & Document>;
  totalValue: number;
  reachedValue: number;
  expirationDate: Date;
  category: PopulatedDoc<ExtraIncomeCategoryInterface & Document>;
}

const ExtraIncomeGoalSchema = new Schema<ExtraIncomeGoalInterface>(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalValue: {
      type: Number,
      required: true,
    },
    reachedValue: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "ExtraIncomeCategory",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ExtraIncomeGoal = model<ExtraIncomeGoalInterface>(
  "ExtraIncomeGoal",
  ExtraIncomeGoalSchema
);
export default ExtraIncomeGoal;
