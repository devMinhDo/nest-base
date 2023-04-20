import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';

@Module({
  imports: [],
  exports: [SessionService],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
