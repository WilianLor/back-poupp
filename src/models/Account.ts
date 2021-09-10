import { Schema, model } from "mongoose";

const AccountSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bank: {
    type: Schema.Types.ObjectId,
    ref: "Bank",
    required: true,
  },
  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: "Card",
    },
  ],
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
});

const Account = model("Account", AccountSchema);
export default Account;
