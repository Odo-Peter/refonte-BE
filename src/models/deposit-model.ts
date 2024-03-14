import { Schema, model } from "mongoose";

import { IDepositDocument, TDepositModel } from "../types/deposit";

const schema = new Schema<IDepositDocument, TDepositModel>({
  address: {
    required: true,
    type: String,
  },
  amount: {
    required: true,
    type: String,
  },
  trxId: {
    required: true,
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  method: {
    type: String,
    enum: ["paypal", "stripe"],
  },
});

const Deposit = model<IDepositDocument, TDepositModel>("deposit", schema);

export default Deposit;
