export interface IUserEnrollment {
  _id: string;
  program: string;
  batch: string;
  dayTime: string;
  name: string;
  email: string;
  contactNumber: string;
  country: string;
  gender: string;
  address: string;
  price: number;
  discount: number;
  bought: boolean;
  completed?: boolean;
  stripeFRCustomerId?: string;
  stripeUKCustomerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserEnrollmentDocument extends Document {
  _id: string;
  program: Schema.Types.ObjectId;
  batch: string;
  dayTime: string;
  name: string;
  email: string;
  contactNumber: string;
  country: string;
  gender: string;
  address: string;
  price: number;
  discount: number;
  bought: boolean;
  completed?: boolean;
  stripeFRCustomerId?: string;
  stripeUKCustomerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TUserEnrollmentModel = Model<IUserEnrollmentDocument>;

export interface IUserEnrollmentDataSource {
  create(
    userEnrollment: Omit<IUserEnrollment, "_id" | "createdAt" | "updatedAt">
  ): Promise<IUserEnrollment | null>;
  getUserEnrollmentsByUser(
    email: string,
    completed?: boolean
  ): Promise<IUserEnrollment[]>;
  checkProgramCompletion(email: string, program: string): Promise<boolean>;
}
