import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TimeSheet, TimeSheetDocument } from './schemas/time-sheet.schema';
import { BaseResDto } from '../config/dto/base-res.dto';
import { CreateDto } from './dto/create.dto';
import { TimeSheetStatus } from './constant/time-sheet-status.constant';
import { responseError } from '../utils/responseData';
import { UpdateTimeSheetDto } from './dto/update-time-sheet.dto';

@Injectable()
export class MyTimeSheetService {
  constructor(
    @InjectModel(TimeSheet.name)
    private timeSheetModel: Model<TimeSheetDocument>,
  ) {}

  async getAllTimeSheetOfUser(query: any, userId: number) {
    const { startDate, endDate } = query;
    const result = await this.timeSheetModel.aggregate([
      {
        $match: {
          userId: userId,
          dateAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $lookup: {
          from: 'projectTask',
          localField: 'projectTaskId',
          foreignField: 'id',
          as: 'projectTask',
        },
      },
      { $unwind: { path: '$projectTask', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'project',
          localField: 'projectTask.projectId',
          foreignField: 'id',
          as: 'project',
        },
      },
      { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'task',
          localField: 'projectTask.taskId',
          foreignField: 'id',
          as: 'task',
        },
      },
      { $unwind: { path: '$task', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'customer',
          localField: 'project.customerId',
          foreignField: 'id',
          as: 'customer',
        },
      },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          id: 1,
          projectTaskId: 1,
          dateAt: 1,
          workingTime: 1,
          status: 1,
          note: 1,
          typeOfWork: 1,
          isCharged: 1,
          billable: 1,
          projectName: '$project.name',
          taskName: '$task.name',
          customerName: '$customer.name',
          projectCode: '$project.code',
        },
      },
      // {
      //   $group: {
      //     _id: {
      //       id: '$id',
      //       projectTaskId: '$projectTaskId',
      //       dateAt: '$dateAt',
      //       workingTime: '$workingTime',
      //       status: '$status',
      //       note: '$note',
      //       typeOfWork: '$typeOfWork',
      //       isCharged: '$isCharged',
      //       billable: '$billable',
      //       projectName: '$projectName',
      //       taskName: '$taskName',
      //       customerName: '$customerName',
      //       projectCode: '$projectCode',
      //     },
      //   },
      // },
      // {
      //   $group: {
      //     _id: { projectTaskId: '$_id.projectTaskId' },
      //     timeSheets: {
      //       $push: {
      //         id: '$_id.id',
      //         dateAt: '$_id.dateAt',
      //         workingTime: '$_id.workingTime',
      //         status: '$_id.status',
      //         note: '$_id.note',
      //         typeOfWork: '$_id.typeOfWork',
      //         isCharged: '$_id.isCharged',
      //         billable: '$_id.billable',
      //         projectName: '$_id.projectName',
      //         taskName: '$_id.taskName',
      //         customerName: '$_id.customerName',
      //         projectCode: '$_id.projectCode',
      //       },
      //     },
      //   },
      // },
      // {
      //   $project: {
      //     _id: 0,
      //     projectTaskId: '$_id.projectTaskId',
      //     billable: '$_id.billable',
      //     customerName: '$_id.customerName',
      //     dateAt: `$_id.dateAt`,
      //     id: '$_id.id',
      //     isCharged: '$_id.isCharged',
      //     note: '$_id.note',
      //     projectCode: '$_id.projectCode',
      //     projectName: '$_id.projectName',
      //     status: '$_id.status',
      //     taskName: '$_id.taskName',
      //     typeOfWork: '$_id.typeOfWork',
      //     workingTime: '$_id.workingTime',
      //   },
      // },
    ]);
    return {
      ...BaseResDto,
      result,
    };
  }

  async create(createDto: CreateDto, userId) {
    const currentDate = new Date(createDto.dateAt);
    const startDate = new Date(currentDate.setHours(0, 0, 0, 0));
    const endDate = new Date(currentDate.setHours(23, 59, 59, 999));
    const findTimeSheet = await this.timeSheetModel.findOne({
      userId: userId,
      $and: [{ dateAt: { $gte: startDate } }, { dateAt: { $lte: endDate } }],
    });
    if (findTimeSheet) return responseError(`You logger timeSheet today!!`);
    createDto.userId = userId;
    createDto.status = TimeSheetStatus.New;
    createDto.id = await this.findLastId();
    createDto.dateAt = new Date(createDto.dateAt).getTime();
    const newTimeSheet = await this.timeSheetModel.create(createDto);
    const {
      id,
      typeOfWork,
      note,
      projectTaskId,
      status,
      projectTargetUserId,
      workingTime,
      dateAt,
      targetUserWorkingTime,
      isCharged,
    } = newTimeSheet;
    return {
      ...BaseResDto,
      result: {
        id,
        typeOfWork,
        note,
        projectTaskId,
        status,
        projectTargetUserId,
        workingTime,
        dateAt,
        targetUserWorkingTime,
        isCharged,
      },
    };
  }

  async findLastId() {
    const find = await this.timeSheetModel.findOne({}).sort({ id: -1 });
    let id;
    if (!find) {
      id = 1;
    } else {
      id = find.id + 1;
    }
    return id;
  }

  async findByFilter(filter) {
    return this.timeSheetModel.find(filter);
  }
  async getTimeSheetsOfUser(
    userId: number,
    startDate: number,
    endDate: number,
  ) {
    return this.timeSheetModel.find({
      userId,
      $and: [{ dateAt: { $gte: startDate } }, { dateAt: { $lte: endDate } }],
    });
  }

  async update(data) {
    return this.timeSheetModel.updateOne({ id: data.id }, data);
  }

  async updateByFilter(filter, update, option = { new: true }) {
    return this.timeSheetModel.findOneAndUpdate(filter, update, option);
  }

  async updateMany(filter, update) {
    return this.timeSheetModel.updateMany(filter, update);
  }

  async submitToPending(body: any, userId: number) {
    const { startDate, endDate } = body;
    const timeSheets = await this.getTimeSheetsOfUser(
      userId,
      new Date(startDate).getTime(),
      new Date(endDate).getTime(),
    );

    const updatePromises = timeSheets.map(async (timesheet) => {
      if (timesheet.status === 0) {
        timesheet.status = 1;
        await this.update(timesheet);
      }
    });

    const updateResults = await Promise.all(updatePromises);
    const count = updateResults.filter((result) => result).length;

    return {
      ...BaseResDto,
      result: `Submit success ${count} timeSheets`,
    };
  }

  async delete(Id: number, userId) {
    const findTimeSheet = await this.timeSheetModel.findOne({
      id: Id,
      userId: userId,
    });
    if (!findTimeSheet)
      return responseError(`TimeSheet not found`, `TimeSheet not found`);
    await this.timeSheetModel.deleteOne({ id: Id });
    return {
      ...BaseResDto,
      result: true,
    };
  }

  async getTimeSheet(id: number) {
    console.log(id);
    const findTimeSheet = await this.timeSheetModel.findOne({ id: id });
    return {
      ...BaseResDto,
      result: findTimeSheet,
    };
  }

  async updateTimeSheet(updateTimeSheetDto: UpdateTimeSheetDto, userId) {
    const checkTimeSheetByUserId = await this.timeSheetModel.findOne({
      id: updateTimeSheetDto.id,
      userId: userId,
    });
    if (!checkTimeSheetByUserId)
      return responseError(`TimeSheet not found`, `TimeSheet not found!!`);
    const updateTimeSheet = await this.timeSheetModel.findOneAndUpdate(
      { id: updateTimeSheetDto.id },
      updateTimeSheetDto,
      { new: true },
    );
    const {
      id,
      typeOfWork,
      note,
      projectTaskId,
      status,
      projectTargetUserId,
      workingTime,
      dateAt,
      targetUserWorkingTime,
      isCharged,
    } = updateTimeSheet;
    return {
      ...BaseResDto,
      result: {
        id,
        typeOfWork,
        note,
        projectTaskId,
        status,
        projectTargetUserId,
        workingTime,
        dateAt,
        targetUserWorkingTime,
        isCharged,
      },
    };
  }

  async getTimeSheetByAggregate(
    startDate: number,
    endDate: number,
    status: number,
  ) {
    const result = await this.timeSheetModel.aggregate([
      {
        $match: {
          status: status,
        },
      },
      {
        $lookup: {
          from: 'projectTask',
          localField: 'projectTaskId',
          foreignField: 'id',
          as: 'projectTask',
        },
      },
      { $unwind: { path: '$projectTask', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'user',
          localField: 'userId',
          foreignField: 'id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'task',
          localField: 'projectTask.taskId',
          foreignField: 'id',
          as: 'task',
        },
      },
      { $unwind: { path: '$task', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'projectUser',
          let: { projectId: 'projectTask.projectId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['projectId', 'projectId'] },
                    { $eq: ['type', 1] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: 'user',
                let: { userId: 'userId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['id', 'userId'] }],
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
      { $unwind: { path: '$listPM', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'project',
          localField: 'projectTask.projectId',
          foreignField: 'id',
          as: 'project',
        },
      },
      { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'customer',
          localField: 'project.customerId',
          foreignField: 'id',
          as: 'customer',
        },
      },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          status: 1,
          workingTime: 1,
          dateAt: 1,
          projectId: '$projectTask.projectId',
          user: '$user.name',
          userId: 1,
          taskId: '$projectTask.taskId',
          taskName: '$task.name',
          mytimesheetNote: '$note',
          customerName: '$customer.name',
          projectName: '$project.name',
          projectCode: '$project.code',
          typeOfWork: 1,
          isCharged: 1,
          isUserInProject: { $literal: true },
          branchName: '$user.branch',
          branch: '$user.branch',
          type: '$user.type',
          avatarPath: '$user.avatarPath',
          avatarFullPath: '$user.avatarFullPath',
          level: '$user.level',
          listPM: '$listPM.name.name',
          id: 1,
        },
      },
    ]);
    return result;
  }
}
