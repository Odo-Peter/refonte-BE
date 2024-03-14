import { Model } from "mongoose";
import { IUserApplication } from "../types/user-application";

export class UserApplicationDataSource {
  constructor(private userApplication: Model<IUserApplication>) {}

  async create(userApplication: Omit<IUserApplication, "_id">): Promise<IUserApplication> {
    const _userApplication = new this.userApplication(userApplication);
    return _userApplication.save();
  }

  async getAll(): Promise<IUserApplication[]> {
    return await this.userApplication.find();
  }

  async getById(id: string): Promise<IUserApplication | null> {
    return await this.userApplication.findById(id);
  }

  async getByUserId(userId: string): Promise<IUserApplication[]> {
    return await this.userApplication.find({ user: userId }).populate("application");
  }
}
