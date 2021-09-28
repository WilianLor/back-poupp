import { Schema, model, PopulatedDoc, Document } from "mongoose";

import { UserInterface } from "./User";

export interface BillInterface {
  value: number;
  interest: number;
  paidValue: number;
  interestType: string;
  user: PopulatedDoc<UserInterface & Document>;
  createdAt: Date;
  updatedAt: Date;
}

const BillSchema = new Schema(
  {
    value: {
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

const Bill = model("Bill", BillSchema);
export default Bill;
