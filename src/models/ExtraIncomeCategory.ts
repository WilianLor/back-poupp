import { Schema, model } from "mongoose";

export interface ExtraIncomeCategoryInterface {
  name: string;
  type: string;
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
});

const ExtraIncomeCategory = model<ExtraIncomeCategoryInterface>(
  "ExtraIncomeCategory",
  ExtraIncomeCategorySchema
);
export default ExtraIncomeCategory;
