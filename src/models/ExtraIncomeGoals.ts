import { Schema, model } from "mongoose";

const ExtraIncomeGoalSchema = new Schema({
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

const ExtraIncomeGoal = model("ExtraIncomeGoal", ExtraIncomeGoalSchema);
export default ExtraIncomeGoal;
