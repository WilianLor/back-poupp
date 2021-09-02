import { Schema, model } from "mongoose";

const TransactionSchema = new Schema({
    title: {
        type: String,
        required:  true
    },
    value: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    transferAccount: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    isCard: {
        type: Boolean,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

const Transaction = model("Transaction", TransactionSchema);
export default Transaction;
