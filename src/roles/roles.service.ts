import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { response } from 'express';
import { Model } from 'mongoose';
import { UserRoles } from 'src/users/constant/user-role.constant';
import { Role, RoleDocument } from './schema/role.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {
    this.init();
  }

  async init() {
    const roleUser = await this.roleModel.findOne({
      displayName: UserRoles.USER,
    });
    const roleAdmin = await this.roleModel.findOne({
      displayName: UserRoles.ADMIN,
    });
    if (!roleUser) {
      await this.roleModel.create({
        displayName: UserRoles.USER,
        name: 'user',
        id: 1,
        normalizedName: UserRoles.USER,
        description: UserRoles.USER,
      });
    }

    if (!roleAdmin) {
      await this.roleModel.create({
        displayName: UserRoles.ADMIN,
        name: 'admin',
        id: 2,
        normalizedName: 'admin',
        description: 'admin',
      });
    }
  }

  async findByCode(code: string) {
    return this.roleModel.findOne({ displayName: code });
  }

  async getRole(filter = {}) {
    return this.roleModel.find(filter);
  }

  async getRoleId(arrNameRoles) {
    return this.roleModel.find({ name: { $in: arrNameRoles } }).select('_id');
  }
}
