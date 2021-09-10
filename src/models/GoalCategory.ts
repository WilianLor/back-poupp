import { Schema, model } from "mongoose";

const GoalCategorySchema = new Schema({
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

const GoalCategory = model("GoalCategory", GoalCategorySchema);
export default GoalCategory;
