import { Schema, model } from "mongoose";

const GoalSchema = new Schema({
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
    ref: "GoalCategory",
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Goal = model("Goal", GoalSchema);
export default Goal;
