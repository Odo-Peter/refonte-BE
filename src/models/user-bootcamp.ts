import { Schema, model } from "mongoose";
import { IUserBootcampDocument, TUserBootcampModel } from "../types/user-bootcamp";

const UserBootcampSchema = new Schema<IUserBootcampDocument, TUserBootcampModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    program: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    dayTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserBootcamp = model<IUserBootcampDocument, TUserBootcampModel>("user_bootcamp", UserBootcampSchema);

export default UserBootcamp;
