import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TimeSheet, TimeSheetDocument } from './schemas/time-sheet.schema';
import { BaseResDto } from '../config/dto/base-res.dto';
import { CreateDto } from './dto/create.dto';
import { TimeSheetStatus } from './constant/time-sheet-status.constant';

@Injectable()
export class MyTimeSheetService {
  constructor(
    @InjectModel(TimeSheet.name)
    private timeSheetModel: Model<TimeSheetDocument>,
  ) {}

  async getAllTimeSheetOfUser(query: any, userId: number) {
    const { startDate, endDate } = query;
    const test = await this.timeSheetModel.find({
      userId: userId,
      $and: [
        { dateAt: { $gte: new Date(startDate) } },
        { dateAt: { $lte: new Date(endDate) } },
      ],
    });
    console.log(test);
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
}
