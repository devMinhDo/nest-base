import { Controller } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('projectUser')
@Controller('projectUser')
export class ProjectUserController {
  constructor(private readonly projectUserService: ProjectUserService) {}
}
