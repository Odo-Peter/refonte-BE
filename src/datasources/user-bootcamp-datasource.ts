import { Model } from "mongoose";
import { IUserBootcamp } from "../types/user-bootcamp";

export class UserBootcampDataSource {
  constructor(private userBootcamp: Model<IUserBootcamp>) {}

  async create(userBootcamp: Omit<IUserBootcamp, "_id">): Promise<IUserBootcamp> {
    const _userBootcamp = new this.userBootcamp(userBootcamp);
    return _userBootcamp.save();
  }

  async getAll(): Promise<IUserBootcamp[]> {
    return await this.userBootcamp.find();
  }

  async getById(id: string): Promise<IUserBootcamp | null> {
    return await this.userBootcamp.findById(id);
  }

  async getByUserId(userId: string): Promise<IUserBootcamp[]> {
    return await this.userBootcamp.find({ user: userId }).populate("bootcamp");
  }
}
