import { Schema } from "mongoose";

export interface IUserBootcamp {
  _id: string;
  user: string;
  program: string;
  field: string;
  dayTime: string;
}

export interface IUserBootcampDocument extends Document {
  _id: string;
  user: Schema.Types.ObjectId;
  program: string;
  field: string;
  dayTime: string;
}

export type TUserBootcampModel = Model<IUserBootcampDocument>;

export interface IUserBootcampDataSource {
  create(userBootcamp: Omit<IUserBootcamp, "_id">): Promise<IUserBootcamp | null>;
  getAll(): Promise<IUserBootcamp[]>;
  getById(id: string): Promise<IUserBootcamp | null>;
  getByUserId(userId: string): Promise<IUserBootcamp[]>;
}
