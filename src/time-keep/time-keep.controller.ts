import { Controller, Get, HttpCode, Query, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseResDto } from '../config/dto/base-res.dto';
import { DataFake } from './constant/data-fake.constant';
@ApiBearerAuth()
@ApiTags('services/app/Timekeeping')
@Controller('services/app/Timekeeping')
export class TimeKeepController {
  @HttpCode(200)
  @Get('GetMyDetails')
  getMyDetails(@Query() query: any) {
    return {
      ...BaseResDto,
      result: DataFake,
    };
  }
}
