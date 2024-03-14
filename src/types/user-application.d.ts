import { Schema } from "mongoose";

export interface IUserApplication {
  _id: string;
  user: string;
  program: string;
  field: string;
  cohort: string;
}

export interface IUserApplicationDocument extends Document {
  _id: string;
  user: Schema.Types.ObjectId;
  program: string;
  field: string;
  cohort: string;
}

export type TUserApplicationModel = Model<IUserApplicationDocument>;

export interface IUserApplicationDataSource {
  create(userApplication: Omit<IUserApplication, "_id">): Promise<IUserApplication | null>;
  getAll(): Promise<IUserApplication[]>;
  getById(id: string): Promise<IUserApplication | null>;
  getByUserId(userId: string): Promise<IUserApplication[]>;
}
