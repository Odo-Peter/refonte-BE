import { Schema, model } from "mongoose";
import { IUserCourseDocument, TUserCourseModel } from "../types/user-course";

const UserCourseSchema = new Schema<IUserCourseDocument, TUserCourseModel>(
  {
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "course",
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    batch: String,
    dayTime: String,
  },
  {
    timestamps: true,
  }
);

const UserCourseModel = model<IUserCourseDocument, TUserCourseModel>(
  "user_course",
  UserCourseSchema
);

export default UserCourseModel;
