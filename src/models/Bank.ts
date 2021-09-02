import { Schema, model } from "mongoose";

const BankSchema = new Schema({
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

const Bank = model("Bank", BankSchema);
export default Bank;
