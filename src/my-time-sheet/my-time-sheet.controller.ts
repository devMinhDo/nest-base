import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MyTimeSheetService } from './my-time-sheet.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';
import { CreateDto } from './dto/create.dto';
import { UpdateTimeSheetDto } from './dto/update-time-sheet.dto';

@ApiBearerAuth()
@ApiTags('services/app/MyTimesheets')
@Controller('services/app/MyTimesheets')
export class MyTimeSheetController {
  constructor(private readonly myTimeSheetService: MyTimeSheetService) {}

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get('GetAllTimeSheetOfUser')
  async getAllTimeSheetOfUser(@Query() query: any, @Req() req: any) {
    return this.myTimeSheetService.getAllTimeSheetOfUser(query, req.user.id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('Create')
  async create(@Body() createDto: CreateDto, @Req() req: any) {
    return this.myTimeSheetService.create(createDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('SubmitToPending')
  async submitToPending(@Body() body: any, @Req() req: any) {
    return this.myTimeSheetService.submitToPending(body, req.user.id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Delete('Delete')
  async delete(@Query() query: any, @Req() req: any) {
    return this.myTimeSheetService.delete(query.Id, req.user.id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get('Get')
  async get(@Query() query: any) {
    return this.myTimeSheetService.getTimeSheet(query.id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Put('Update')
  async update(
    @Body() updateTimeSheetDto: UpdateTimeSheetDto,
    @Req() req: any,
  ) {
    return this.myTimeSheetService.updateTimeSheet(
      updateTimeSheetDto,
      req.user.id,
    );
  }
}
