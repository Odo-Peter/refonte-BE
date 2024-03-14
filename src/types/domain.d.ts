export interface IDomain {
  _id: string;
  name: string;
  courses: any[];
}

export interface IDomainDocument extends Document {
  _id: string;
  name: string;
  courses: any[];
}

export type TDomainModel = Model<IDomainDocument>;

export interface IDomainDataSource {
  create(domain: Omit<IDomain, "_id">): Promise<IDomain | null>;
  getAll(): Promise<IDomain[]>;
  getByName(name: string): Promise<IDomain | null>;
  getById(id: string): Promise<IDomain | null>;
  getWithCourses(): Promise<IDomain[]>;
}
