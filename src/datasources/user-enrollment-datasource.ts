import { Model } from "mongoose";
import { IUserEnrollment } from "../types/user-enrollment";

export class UserEnrollmentDataSource {
  constructor(private userEnrollment: Model<IUserEnrollment>) {}

  async create(
    userEnrollment: Omit<
      IUserEnrollment,
      "_id" | "createdAt" | "updatedAt" | "bought"
    >
  ): Promise<IUserEnrollment | null> {
    const _userEnrollment = new this.userEnrollment(userEnrollment);
    return _userEnrollment.save();
  }

  async getUserEnrollments(): Promise<IUserEnrollment[]> {
    return await this.userEnrollment.find();
  }

  async getUserEnrollmentsByUser(
    email: string,
    completed?: boolean
  ): Promise<IUserEnrollment[]> {
    const completedQuery = !completed
      ? {
          $or: [
            { completed: false },
            { completed: null },
            { completed: undefined },
          ],
        }
      : { completed: true };

    return await this.userEnrollment
      .find({ email, ...completedQuery })
      .populate("program")
      .sort({ _id: -1 });
  }

  async checkProgramCompletion(
    email: string,
    program: string
  ): Promise<boolean> {
    const _program = await this.userEnrollment.exists({
      program,
      email,
      $or: [
        { completed: false },
        { completed: null },
        { completed: undefined },
      ],
    });

    return _program ? false : true;
  }
}
