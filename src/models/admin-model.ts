import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IAdminDocument, TAdminModel } from '../types/admin';

const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

const AdminSchema = new Schema<IAdminDocument, TAdminModel>(
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
        message: 'Invalid email format',
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
      default: USER_ROLES.ADMIN,
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

AdminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  next();
});

AdminSchema.methods.isValidPassword = async function (password: string) {
  const encryptedPassword = (await AdminModel.findOne({ email: this.email }).select('password'))?.password as string;

  const compare = await bcrypt.compare(password, encryptedPassword);
  return compare;
};

const AdminModel = model<IAdminDocument, TAdminModel>('admin', AdminSchema);

export default AdminModel;
