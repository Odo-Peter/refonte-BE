import { Model } from "mongoose";
import { ICourse } from "../types/course";
import { flattenObject } from "../utils/helpers";

export class CourseDataSource {
  constructor(private course: Model<ICourse>) {}

  async create(course: Omit<ICourse, "_id">): Promise<ICourse> {
    const _course = new this.course(course);
    return _course.save();
  }

  async getAll(): Promise<ICourse[]> {
    return await this.course.find();
  }

  async getById(id: string): Promise<ICourse | null> {
    return await this.course.findById(id);
  }

  async getByNameAndDomain(
    name: string,
    domain: string
  ): Promise<ICourse | null> {
    return await this.course.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      domain,
    });
  }

  async getByUrl(url: string): Promise<ICourse | null> {
    return await this.course.findOne({ url });
  }

  async updateByUrl(
    url: string,
    course: Partial<ICourse>
  ): Promise<ICourse | null> {
    
    const flattenInput = flattenObject(course);

    return await this.course.findOneAndUpdate(
      { url },
      { $set: flattenInput },
      { new: true }
    );
  }
}
