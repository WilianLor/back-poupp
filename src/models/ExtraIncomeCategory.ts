import { Schema, model } from "mongoose";

export interface ExtraIncomeCategoryInterface {
  name: string;
  type: string;
  image: string;
}

const ExtraIncomeCategorySchema = new Schema<ExtraIncomeCategoryInterface>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const ExtraIncomeCategory = model<ExtraIncomeCategoryInterface>(
  "ExtraIncomeCategory",
  ExtraIncomeCategorySchema
);
export default ExtraIncomeCategory;
