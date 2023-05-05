import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TimeSheetService } from './time-sheet.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';

@ApiBearerAuth()
@ApiTags('services/app/Timesheet')
@Controller('services/app/Timesheet')
export class TimeSheetController {
  constructor(private readonly timeSheetService: TimeSheetService) {}

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get('GetAll')
  async getAll(@Query() query: any) {
    return await this.timeSheetService.getAll(query);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('ApproveTimesheets')
  async approveTimeSheets(@Body() arrIds: number[]) {
    return await this.timeSheetService.approveTimeSheets(arrIds);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('RejectTimesheets')
  async rejectTimeSheets(@Body() arrIds: number[]) {
    return await this.timeSheetService.rejectTimeSheets(arrIds);
  }
}
