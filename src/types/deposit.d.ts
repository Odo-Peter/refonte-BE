import { IUser } from "./user";

export interface IDeposit {
  _id: string;
  address: string;
  amount: string;
  trxId: string;
  createdAt: Date;
  method: "stripe" | "paypal";
}
// all type with  _d for Mongo document
export interface IDepositDocument extends Document {
  _id: string;
  address: string;
  amount: string;
  trxId: string;
  createdAt: Date;
  method: string;
}

export type TDepositModel = Model<IDepositDocument>;

export interface IDepositDataSource {
  getAll(): Promise<IDeposit[]>;
  getById(id: string): Promise<IDeposit | null>;
  create(input: Omit<IDeposit, "_id">): Promise<DepositModel | null>;
  updateById(
    id: string,
    input: Partial<IDeposit>
  ): Promise<DepositModel | null>;
  deleteById(id: string): Promise<IDeposit | null>;
  getByTransactionId(id: string): Promise<IDeposit | null>;
  getAllByPaymentMethod(
    method: "stripe" | "paypal" | "crypto"
  ): Promise<IDeposit[]>;
}
