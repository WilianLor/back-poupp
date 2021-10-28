import { Schema, model, PopulatedDoc, Document } from "mongoose";

import { GoalCategoryInterface } from "./GoalCategory";
import { UserInterface } from "./User";

export interface GoalInterface {
  title: string;
  totalValue: number;
  reachedValue: number;
  category: PopulatedDoc<GoalCategoryInterface & Document>;
  expirationDate: Date;
  user: PopulatedDoc<UserInterface & Document>;
}

const GoalSchema = new Schema<GoalInterface>({
  title: {
    type: String,
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
