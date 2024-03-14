import { Model } from "mongoose";
import { IDomain } from "../types/domain";

export class DomainDataSource {
  constructor(private domain: Model<IDomain>) {}

  async create(domain: Omit<IDomain, "_id">): Promise<IDomain> {
    const _domain = new this.domain(domain);
    return _domain.save();
  }

  async getAll(): Promise<IDomain[]> {
    return await this.domain.find();
  }

  async getWithCourses(): Promise<IDomain[]> {
    return await this.domain.find().populate("courses");
  }

  async getById(id: string): Promise<IDomain | null> {
    return await this.domain.findById(id);
  }

  async getByName(name: string): Promise<IDomain | null> {
    return await this.domain.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
  }
}
