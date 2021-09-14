import { Schema, model } from "mongoose";

export interface AccountInterface {
  username: string;
  user: Schema.Types.ObjectId;
  bank: Schema.Types.ObjectId;
  cards: Schema.Types.ObjectId[];
  transactions: Schema.Types.ObjectId[];
}

const AccountSchema = new Schema<AccountInterface>({
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

const Account = model<AccountInterface>("Account", AccountSchema);
export default Account;
