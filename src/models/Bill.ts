import { Schema, model } from "mongoose";

const BillSchema = new Schema({
  value: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
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
});

const Bill = model("Bill", BillSchema);
export default Bill;