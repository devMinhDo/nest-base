import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { MyTimeSheetService } from './my-time-sheet.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';
import { CreateDto } from './dto/create.dto';

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
}
