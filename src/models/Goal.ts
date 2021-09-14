import { Schema, model } from "mongoose";

export interface GoalInterface {
  totalValue: number;
  reachedValue: number;
  category: Schema.Types.ObjectId;
  expirationDate: Date;
  user: Schema.Types.ObjectId;
}

const GoalSchema = new Schema<GoalInterface>({
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

const Goal = model<GoalInterface>("Goal", GoalSchema);
export default Goal;
