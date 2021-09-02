import { Schema, model } from "mongoose";

const ExtraIncomeCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  pictureUrl: {
    type: String,
    required: true,
  },
});

const ExtraIncomeCategory = model(
  "ExtraIncomeCategory",
  ExtraIncomeCategorySchema
);
export default ExtraIncomeCategory;
