import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { BaseResDto } from '../config/dto/base-res.dto';
import { responseError } from '../utils/responseData';
import { SaveDto } from './dto/save.dto';
import { DeArchiveDto } from './dto/deArchive.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
  ) {}

  async getAll() {
    const result = await this.taskModel.find({ isHide: false });
    return {
      ...BaseResDto,
      result: result,
    };
  }

  async save(saveDto: SaveDto) {
    const { name, id } = saveDto;
    if (!id) {
      const findTask = await this.taskModel.findOne({ name });
      if (findTask)
        return responseError(
          `Name task already exist`,
          `Name task already exist`,
        );
      const findLastTask = await this.taskModel.findOne({}).sort({ id: -1 });
      if (!findLastTask) {
        saveDto.id = 1;
      } else {
        saveDto.id = findLastTask.id + 1;
      }
      const newTask = await this.taskModel.create(saveDto);
      return {
        ...BaseResDto,
        result: newTask,
      };
    } else {
      const findTask = await this.taskModel.findOne({ id });
      if (!findTask) return responseError(`Task not found!`, `Task not found!`);
      const updateTask = await this.taskModel.findOneAndUpdate(
        { id },
        { name: saveDto.name, type: saveDto.type },
        { new: true },
      );
      return {
        ...BaseResDto,
        result: updateTask,
      };
    }
  }

  async archive(Id: number) {
    const findTask = await this.taskModel.findOne({ id: Id });
    if (!findTask) return responseError(`Task not found`, `Task not found`);
    const archiveTask = await this.taskModel.findOneAndUpdate(
      { id: Id },
      { isDeleted: true },
      { new: true },
    );
    return {
      ...BaseResDto,
      result: archiveTask,
    };
  }

  async deArchive(deArchiveDto: DeArchiveDto) {
    const findTask = await this.taskModel.findOne({ id: deArchiveDto.id });
    if (!findTask) return responseError(`Task not found`, `Task not found`);
    const archiveTask = await this.taskModel.findOneAndUpdate(
      { id: deArchiveDto.id },
      { isDeleted: false },
      { new: true },
    );
    return {
      ...BaseResDto,
      result: archiveTask,
    };
  }

  async delete(Id: number) {
    const findTask = await this.taskModel.findOne({ id: Id });
    if (!findTask) return responseError(`Task not found`, `Task not found`);
    if (findTask.isDeleted === false) {
      return responseError(`Task unArchive`, `Task unArchive`);
    }
    await this.taskModel.updateOne({ id: Id }, { isHide: true });
    return {
      ...BaseResDto,
    };
  }
}
