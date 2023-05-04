import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProjectTaskDocument,
  ProjectTask,
} from './schemas/project-task.schema';

@Injectable()
export class ProjectTaskService {
  constructor(
    @InjectModel(ProjectTask.name)
    private projectTaskModel: Model<ProjectTaskDocument>,
  ) {}

  async createID() {
    const findLastId = await this.projectTaskModel.findOne({}).sort({ id: -1 });
    let id;
    if (!findLastId) {
      id = 1;
    } else {
      id = findLastId.id + 1;
    }
    return id;
  }

  async create(projectTask) {
    return this.projectTaskModel.create(projectTask);
  }

  async findOne(filter) {
    return this.projectTaskModel.findOne(filter);
  }

  async update(filter, update, option = { new: true }) {
    return this.projectTaskModel.findOneAndUpdate(filter, update, option);
  }

  async findByFilter(filter) {
    return this.projectTaskModel.find(filter);
  }

  async deleteManyByProjectId(projectId) {
    return this.projectTaskModel.deleteMany({ projectId: projectId });
  }
  async insertMany(data) {
    return this.projectTaskModel.insertMany(data);
  }
}
