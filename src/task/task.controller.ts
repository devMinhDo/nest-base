import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SaveDto } from './dto/save.dto';
import { DeArchiveDto } from './dto/deArchive.dto';

@ApiBearerAuth()
@ApiTags('services/app/Task')
@Controller('services/app/Task')
export class TaskController {
  constructor(private readonly projectTaskService: TaskService) {}

  @HttpCode(200)
  @Get('GetAll')
  async getAll() {
    return this.projectTaskService.getAll();
  }

  @HttpCode(200)
  @Post('Save')
  async save(@Body() saveDto: SaveDto) {
    return this.projectTaskService.save(saveDto);
  }

  @HttpCode(200)
  @Delete('Archive')
  async archive(@Query('Id') Id: number) {
    return this.projectTaskService.archive(Id);
  }

  @HttpCode(200)
  @Post('DeArchive')
  async deArchive(@Body() deArchiveDto: DeArchiveDto) {
    return this.projectTaskService.deArchive(deArchiveDto);
  }

  @HttpCode(200)
  @Delete('Delete')
  async delete(@Query('Id') Id: number) {
    return this.projectTaskService.delete(Id);
  }
}
