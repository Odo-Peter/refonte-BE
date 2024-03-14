export interface IAdmin {
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

export interface IAdminDocument extends Document {
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
export interface IAdminMethods {
  isValidPassword: (password: string) => Promise<boolean>;
}
export type TAdminModel = Model<IAdminDocument, object, IAdminMethods>;

export interface IAdminDataSource {
  create(admin: Omit<IAdmin, 'validated' | '_id' | 'role'>): Promise<IAdmin | null>;
  getAdmins(): Promise<IAdmin[]>;
  getByEmail(email: string): Promise<TUserModel | null>;
  // getById(id: string): Promise<IAdmin | null>;
  // updateUser(
  //   filter: object,
  //   userInput: Partial<IAdmin & { password?: string }>
  // ): Promise<any>;
}
