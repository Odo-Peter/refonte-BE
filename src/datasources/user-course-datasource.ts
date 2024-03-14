import { Model } from "mongoose";
import { IUserCourse } from "../types/user-course";

export class UserCourseDataSource {
  constructor(private userCourse: Model<IUserCourse>) {}

  async create(userCourse: Omit<IUserCourse, "_id">): Promise<IUserCourse> {
    const _userCourse = new this.userCourse(userCourse);
    return _userCourse.save();
  }

  async getAll(): Promise<IUserCourse[]> {
    return await this.userCourse.find();
  }

  async getById(id: string): Promise<IUserCourse | null> {
    return await this.userCourse.findById(id);
  }

  async getByUserId(userId: string): Promise<IUserCourse[]> {
    return await this.userCourse.find({ user: userId }).populate("course");
  }
}
