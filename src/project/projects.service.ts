import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { GetAllDto } from './dto/get-all.dto';
import { BaseResDto } from '../config/dto/base-res.dto';
import { SaveDto } from './dto/save.dto';
import { responseError } from '../utils/responseData';
import { ProjectTaskService } from '../project-task/project-task.service';
import { ProjectUserService } from '../project-user/project-user.service';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @Inject(forwardRef(() => ProjectTaskService))
    private projectTaskService: ProjectTaskService,
    @Inject(forwardRef(() => ProjectUserService))
    private projectUserService: ProjectUserService,
  ) {}

  async getAll(getAllDto: GetAllDto) {
    const search = { $regex: `.*${getAllDto.search}.*`, $options: 'i' };
    let result = [];
    if (!getAllDto.search) {
      result = await this.projectModel.find({
        status: getAllDto.status,
      });
    } else {
      result = await this.projectModel.find({
        status: getAllDto.status,
        name: search,
      });
    }

    return {
      ...BaseResDto,
      result: result,
    };
  }

  async save(saveDto: SaveDto) {
    const { tasks, users, ...project } = saveDto;
    let result;
    if (saveDto.id) {
      const checkId = await this.projectModel.findOne({ id: saveDto.id });
      if (!checkId)
        return responseError(`Project not found!!`, `Project not found!!`);

      await Promise.all([
        this.projectTaskService.deleteManyByProjectId(saveDto.id),
        this.projectUserService.deleteManyByProjectId(saveDto.id),
      ]);

      const [findLastIdTask, findLastIdProjectUser] = await Promise.all([
        this.projectTaskService.createID(),
        this.projectUserService.createId(),
      ]);

      const insertProjectTask = tasks.map((item, index) => ({
        id: findLastIdTask + index,
        projectId: saveDto.id,
        taskId: item.taskId,
      }));

      const insertProjectUser = users.map((item, index) => ({
        id: findLastIdProjectUser + index,
        projectId: saveDto.id,
        userId: item.userId,
        type: item.type,
      }));
      await Promise.all([
        this.projectTaskService.insertMany(insertProjectTask),
        this.projectUserService.insertMany(insertProjectUser),
      ]);
      result = await this.projectModel.findOneAndUpdate(
        { id: saveDto.id },
        project,
      );
    } else {
      const findLastId = await this.projectModel.findOne({}).sort({ id: -1 });
      project.id = findLastId ? findLastId.id + 1 : 1;
      project.status = project.status ?? 0;

      const [findLastIdTask, findLastIdProjectUser] = await Promise.all([
        this.projectTaskService.createID(),
        this.projectUserService.createId(),
      ]);

      const insertProjectTask = tasks.map((item, index) => ({
        id: findLastIdTask + index,
        projectId: project.id,
        taskId: item.taskId,
      }));

      const insertProjectUser = users.map((item, index) => ({
        id: findLastIdProjectUser + index,
        projectId: project.id,
        userId: item.userId,
        type: item.type,
      }));

      await Promise.all([
        this.projectTaskService.insertMany(insertProjectTask),
        this.projectUserService.insertMany(insertProjectUser),
        (result = this.projectModel.create(project)),
      ]);
    }
    return {
      ...BaseResDto,
      result: result,
    };
  }

  async get(input: number) {
    const projectTasksPromise = this.projectTaskService.findByFilter({
      projectId: input,
    });
    const projectUsersPromise = this.projectUserService.findByFilter({
      projectId: input,
    });
    const [project, tasks, users]: any = await Promise.all([
      this.projectModel.findOne({ id: input }),
      projectTasksPromise,
      projectUsersPromise,
    ]);
    users.forEach((item) => {
      item.type = Number(item.type);
    });
    if (!project) return responseError(`Project not found`);
    const { _v, _id, ...projectData } = project._doc;
    const result = {
      ...projectData,
      tasks,
      users,
    };
    return { ...BaseResDto, result };
  }

  async getProjectsIncludingTasks(userId) {
    const result = await this.projectUserService.aggregate([
      { $match: { userId: userId } },
      {
        $lookup: {
          from: 'project',
          localField: 'projectId',
          foreignField: 'id',
          as: 'project',
        },
      },
      { $unwind: '$project' },
      {
        $lookup: {
          from: 'customer',
          localField: 'project.customerId',
          foreignField: 'id',
          as: 'customer',
        },
      },
      { $unwind: '$customer' },
      {
        $lookup: {
          from: 'projectUser',
          let: { projectId: '$project.id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$projectId', '$$projectId'] },
                    { $eq: ['$type', 1] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: 'user',
                let: { userId: '$userId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$id', '$$userId'] }],
                      },
                    },
                  },
                ],
                as: 'name',
              },
            },
          ],
          as: 'listPM',
        },
      },
      { $unwind: '$listPM' },
      {
        $lookup: {
          from: 'projectTask',
          localField: 'project.id',
          foreignField: 'projectId',
          as: 'projectTasks',
          pipeline: [
            {
              $lookup: {
                from: 'task',
                localField: 'taskId',
                foreignField: 'id',
                as: 'taskName',
              },
            },
            { $unwind: '$taskName' },
            {
              $project: {
                projectTaskId: '$projectId',
                billable: '$billable',
                taskName: '$taskName.name',
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'task',
          localField: 'projectTasks.taskId',
          foreignField: 'id',
          as: 'tasks',
        },
      },
      {
        $project: {
          customerName: '$customer.name',
          id: '$project.id',
          listPM: '$listPM.name.name',
          projectCode: '$project.code',
          projectName: '$project.name',
          projectUserType: '$type',
          tasks: '$projectTasks',
          targetUsers: '$targetUsers',
          _id: 0,
        },
      },
      { $sort: { 'project.name': 1, 'customer.name': 1, 'project.code': 1 } },
    ]);
    return {
      ...BaseResDto,
      result: result,
    };
  }
}
