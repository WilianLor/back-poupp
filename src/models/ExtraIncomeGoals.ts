import { Schema, model } from "mongoose";

export interface ExtraIncomeGoalInterface {
  user: Schema.Types.ObjectId;
  totalValue: number;
  reachedValue: number;
  expirationDate: Date;
  category: Schema.Types.ObjectId;
}

const ExtraIncomeGoalSchema = new Schema<ExtraIncomeGoalInterface>({
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
  expirationDate: {
    type: Date,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "ExtraIncomeCategory",
    required: true,
  },
});

const ExtraIncomeGoal = model<ExtraIncomeGoalInterface>(
  "ExtraIncomeGoal",
  ExtraIncomeGoalSchema
);
export default ExtraIncomeGoal;
