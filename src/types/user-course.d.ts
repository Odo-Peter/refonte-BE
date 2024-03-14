import { Schema } from "mongoose";

export interface IUserCourse {
  _id: string;
  course: string;
  user: string;
  batch: string;
  dayTime: string;
}

export interface IUserCourseDocument extends Document {
  _id: string;
  course: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  batch: string;
  dayTime: string;
}

export type TUserCourseModel = Model<IUserCourseDocument>;

export interface IUserCourseDataSource {
  create(userCourse: Omit<IUserCourse, "_id">): Promise<IUserCourse | null>;
  getAll(): Promise<IUserCourse[]>;
  getById(id: string): Promise<IUserCourse | null>;
  getByUserId(userId: string): Promise<IUserCourse[]>;
}
