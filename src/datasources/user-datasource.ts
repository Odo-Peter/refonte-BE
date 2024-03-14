import { Model } from "mongoose";
import { IUser } from "../types/user";
import bcrypt from "bcrypt";

export class UserDataSource {
  constructor(private user: Model<IUser>) {}

  // TODO: create a new createAdmin when needed but don't use this for that
  async create(
    user: Omit<IUser, "validated" | "_id" | "role">
  ): Promise<IUser> {
    const _user = new this.user(user);
    return _user.save();
  }

  async getUsers(): Promise<IUser[]> {
    return await this.user.find();
  }

  async getByEmail(email: string): Promise<IUser | null> {
    return await this.user.findOne({ email });
  }

  async getById(id: string): Promise<IUser | null> {
    return await this.user.findById(id);
  }

  async updateUser(
    filter: object,
    userInput: Partial<IUser & { password?: string }>
  ) {
    let _userInput = userInput;
    if (_userInput.password) {
      _userInput.password = bcrypt.hashSync(_userInput.password, 10);
    }

    return await this.user.findOneAndUpdate(
      filter,
      {
        $set: _userInput,
      },
      { new: true }
    );
  }
}
