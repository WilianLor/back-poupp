import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: String,
    select: false,
  },
  passwordVersion: {
    type: Number,
    default: 1,
  },
  incomeValue: {
    type: Number,
  },
  accounts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Accounts",
    },
  ],
});

UserSchema.pre("save", async function <type>(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

const User = model("User", UserSchema);
export default User;
