import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { JWTModule } from 'src/jwt.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [JWTModule, UsersModule],
  exports: [SessionService],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
