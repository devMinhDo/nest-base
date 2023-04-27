import { Controller, Get, Body, HttpCode, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConfigurationService } from './configuration.service';
@ApiBearerAuth()
@ApiTags('services/app/configuration')
@Controller('services/app/configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @HttpCode(200)
  @Get('GetWorkingTimeConfigAllBranch')
  getWorkingTimeConfigAllBranch() {
    return this.configurationService.getWorkingTimeConfigAllBranch();
  }
}
