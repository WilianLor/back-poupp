import { Schema, model } from "mongoose";

const CardSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  openDate: {
    type: Date,
    required: true,
  },
  closeDate: {
    type: Date,
    required: true,
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Card = model("Card", CardSchema);
export default Card;
