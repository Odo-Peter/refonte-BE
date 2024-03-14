import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUserDocument, TUserModel } from "../types/user";

const USER_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

const UserSchema = new Schema<IUserDocument, TUserModel>(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 250,
    },
    contactNumber: {
      type: String,
      minlength: 4,
      maxlength: 15,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (_email: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(_email);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 250,
    },
    validated: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: [USER_ROLES.ADMIN, USER_ROLES.USER],
      default: USER_ROLES.USER,
    },
    stripeFRCustomerId: {
      type: String,
    },
    stripeUKCustomerId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  next();
});

UserSchema.methods.isValidPassword = async function (password: string) {
  const encryptedPassword = (
    await UserModel.findOne({ email: this.email }).select("password")
  )?.password as string;

  const compare = await bcrypt.compare(password, encryptedPassword);
  return compare;
};

const UserModel = model<IUserDocument, TUserModel>("user", UserSchema);

export default UserModel;
