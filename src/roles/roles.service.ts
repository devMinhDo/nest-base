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
    const roleUser = await this.roleModel.findOne({ code: UserRoles.USER });
    const roleAdmin = await this.roleModel.findOne({ code: UserRoles.ADMIN });
    if (!roleUser)
      await this.roleModel.create({ code: UserRoles.USER, name: 'user' });
    if (!roleAdmin)
      await this.roleModel.create({ code: UserRoles.ADMIN, name: 'admin' });
  }

  async findByCode(code: string) {
    return this.roleModel.findOne({ code });
  }
}
