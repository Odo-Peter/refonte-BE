import { Model } from 'mongoose';
import { IAdmin } from '../types/admin';
import bcrypt from 'bcrypt';

export class AdminDataSource {
  constructor(private admin: Model<IAdmin>) {}

  async create(admin: Omit<IAdmin, 'validated' | '_id' | 'role'>): Promise<IAdmin> {
    const _admin = new this.admin(admin);
    return _admin.save();
  }

  async getAdmins(): Promise<IAdmin[]> {
    return await this.admin.find();
  }

  async getByEmail(email: string): Promise<IAdmin | null> {
    return await this.admin.findOne({ email });
  }

  async getById(id: string): Promise<IAdmin | null> {
    return await this.admin.findById(id);
  }

  async updateAdmin(filter: object, adminInput: Partial<IAdmin & { password?: string }>) {
    let _adminInput = adminInput;
    if (_adminInput.password) {
      _adminInput.password = bcrypt.hashSync(_adminInput.password, 10);
    }

    return await this.admin.findOneAndUpdate(
      filter,
      {
        $set: _adminInput,
      },
      { new: true }
    );
  }
}
