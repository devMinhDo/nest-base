import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Query,
  Param,
  Req, UseGuards
} from "@nestjs/common";
import { ProjectsService } from './projects.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAllDto } from './dto/get-all.dto';
import { SaveDto } from './dto/save.dto';
import { AuthGuard } from "../guard/auth.guard";
@ApiBearerAuth()
@ApiTags('services/app/Project')
@Controller('services/app/Project')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @HttpCode(200)
  @Get('getAll')
  async getAll(@Query() getAllDto: GetAllDto) {
    return this.projectsService.getAll(getAllDto);
  }

  @HttpCode(200)
  @Post('Save')
  async save(@Body() saveDto: SaveDto) {
    return this.projectsService.save(saveDto);
  }

  @HttpCode(200)
  @Get('Get')
  async get(@Query('input') input: number) {
    return this.projectsService.get(input);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get('getProjectsIncludingTasks')
  async getProjectsIncludingTasks(@Req() req: any) {
    return this.projectsService.getProjectsIncludingTasks(req.user.id);
  }
}
