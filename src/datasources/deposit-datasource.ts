import mongoose, { Model } from "mongoose";

import { IDeposit } from "../types/deposit";
import logger from "../utils/logger";
export class DepositDataSource {
  constructor(private deposit: Model<IDeposit>) {}

  async getAll(): Promise<IDeposit[]> {
    const deposits = await this.deposit.find();

    return deposits;
  }

  async getAllByPaymentMethod(method: "stripe" | "paypal"): Promise<IDeposit[]> {
    const deposits = await this.deposit.find({ method });

    return deposits;
  }

  async getById(id: string): Promise<IDeposit | null> {
    const DepositId = new mongoose.Types.ObjectId(id);
    const Deposit = await this.deposit.findById(DepositId);
    return Deposit;
  }

  async getByTransactionId(id: string): Promise<IDeposit | null> {
    const deposit = await this.deposit.findOne({ trxId: id });

    return deposit;
  }

  async create(DepositData: IDeposit): Promise<IDeposit> {
    const Deposit = new this.deposit(DepositData);
    logger.info("this is working form Deposit DAta", Deposit);
    await Deposit.save();
    return Deposit.toObject();
  }

  async updateById(id: string, DepositData: Partial<IDeposit>): Promise<IDeposit | null> {
    logger.info(DepositData);
    const Deposit = await this.deposit.findByIdAndUpdate(
      id,
      {
        $set: DepositData,
      },
      { new: true }
    );
    return Deposit;
  }

  async deleteById(id: string): Promise<void> {
    await this.deposit.findByIdAndDelete(id);
  }
}
