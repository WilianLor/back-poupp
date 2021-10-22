import { Schema, model } from "mongoose";

export interface BankInterface {
  name: string;
  type: string;
}

const BankSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  picture: {
    type: String,
    required: true,
  },
});

const Bank = model("Bank", BankSchema);
export default Bank;
