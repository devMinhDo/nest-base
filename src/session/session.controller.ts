import {
  Controller,
  Post,
  Body,
  HttpCode,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SessionService } from './session.service';

@ApiBearerAuth()
@ApiTags('services/app/Session')
@Controller('services/app/Session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @HttpCode(200)
  @Get('GetCurrentLoginInformations')
  getCurrentLoginInformation(@Req() req: any, @Res() res: any) {
    return this.sessionService.getCurrentLoginInformation(req, res);
  }
}
