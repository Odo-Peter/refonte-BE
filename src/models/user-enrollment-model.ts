import { Schema, model } from "mongoose";
import {
  IUserEnrollmentDocument,
  TUserEnrollmentModel,
} from "../types/user-enrollment";

const UserEnrollmentSchema = new Schema<
  IUserEnrollmentDocument,
  TUserEnrollmentModel
>(
  {
    program: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "course",
      trim: true,
    },
    batch: {
      type: String,
      required: true,
      trim: true,
    },
    dayTime: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (_email: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(_email);
        },
        message: "Invalid email format",
      },
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    discount: {
      type: Number,
      required: true,
      trim: true,
    },
    bought: {
      type: Boolean,
      default: false,
    },
    stripeFRCustomerId: {
      type: String,
    },
    stripeUKCustomerId: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const UserEnrollmentModel = model<
  IUserEnrollmentDocument,
  TUserEnrollmentModel
>("user_enrollment", UserEnrollmentSchema);
export default UserEnrollmentModel;
