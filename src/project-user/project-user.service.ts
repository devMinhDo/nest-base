import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProjectUser,
  ProjectUserDocument,
} from './schemas/project-user.schema';
import { find } from 'rxjs';

@Injectable()
export class ProjectUserService {
  constructor(
    @InjectModel(ProjectUser.name)
    private projectUserModel: Model<ProjectUserDocument>,
  ) {}

  async createId(): Promise<number> {
    const findLastId = await this.projectUserModel.findOne({}).sort({ id: -1 });
    let id;
    if (!findLastId) {
      id = 1;
    } else {
      id = findLastId.id + 1;
    }
    return id;
  }

  async deleteManyByProjectId(projectId) {
    return this.projectUserModel.deleteMany({ projectId: projectId });
  }

  async create(projectUser) {
    return this.projectUserModel.create(projectUser);
  }

  async findOne(filter) {
    return this.projectUserModel.findOne(filter);
  }

  async findByFilter(filter) {
    return this.projectUserModel.find(filter);
  }

  async insertMany(data) {
    return this.projectUserModel.insertMany(data);
  }

  async aggregate(aggregateOptions) {
    return this.projectUserModel.aggregate(aggregateOptions);
  }
}
