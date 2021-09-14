import { Schema, model } from "mongoose";

export interface GoalCategoryInterface {
  name: string;
  type: string;
}

const GoalCategorySchema = new Schema<GoalCategoryInterface>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const GoalCategory = model<GoalCategoryInterface>(
  "GoalCategory",
  GoalCategorySchema
);
export default GoalCategory;
