export interface IUser {
  _id: string;
  name: string;
  contactNumber?: string;
  email: string;
  password: string;
  validated: boolean;
  role: string;
  createdAt?: Date;
  stripeFRCustomerId?: string;
  stripeUKCustomerId?: string;
}

export interface IUserDocument extends Document {
  _id: string;
  name: string;
  contactNumber?: string;
  validated: boolean;
  email: string;
  password: string;
  role: string;
  updatedAt?: Date;
  stripeFRCustomerId?: string;
  stripeUKCustomerId?: string;
}
export interface IUserMethods {
  isValidPassword: (password: string) => Promise<boolean>;
}
export type TUserModel = Model<IUserDocument, object, IUserMethods>;

export interface IUserDataSource {
  create(user: Omit<IUser, 'validated' | '_id' | 'role'>): Promise<IUser | null>;
  getUsers(): Promise<IUser[]>;
  getUpgradedUsers(): Promise<IUser[]>;
  getByEmail(email: string): Promise<TUserModel | null>;
  getById(id: string): Promise<IUser | null>;
  updateUser(filter: object, userInput: Partial<IUser & { password?: string }>): Promise<any>;
  upgradeUserToAdmin(filter: object, options: object): Promise<IUser | null>;
  deleteUser(id: string): Promise<{} | null>;
}
