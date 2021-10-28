import { Schema, model } from "mongoose";

export interface BankInterface {
  name: string;
  picture: string;
}

const BankSchema = new Schema<BankInterface>({
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

const Bank = model<BankInterface>("Bank", BankSchema);
export default Bank;
