import { Schema, model, PopulatedDoc, Document } from "mongoose";

import { UserInterface } from "./User";

export interface BillInterface {
  title: string;
  remainingValue: number;
  interest: number;
  paidValue: number;
  interestType: string;
  dueDay: number;
  user: PopulatedDoc<UserInterface & Document>;
  createdAt: Date;
  updatedAt: Date;
}

const BillSchema = new Schema<BillInterface>(
  {
    title: {
      type: String,
      required: true,
    },
    remainingValue: {
      type: Number,
      required: true,
    },
    interest: {
      type: Number,
      required: true,
    },
    paidValue: {
      type: Number,
      required: true,
      default: 0,
    },
    dueDay: {
      type: Number,
      required: true,
    },
    interestType: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Bill = model<BillInterface>("Bill", BillSchema);
export default Bill;
