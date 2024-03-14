import { Schema, model } from "mongoose";
import { IUserApplicationDocument, TUserApplicationModel } from "../types/user-application";

const UserApplicationSchema = new Schema<IUserApplicationDocument, TUserApplicationModel>(
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
    cohort: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserApplication = model<IUserApplicationDocument, TUserApplicationModel>("user_application", UserApplicationSchema);

export default UserApplication;
