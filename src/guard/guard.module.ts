import { Module } from '@nestjs/common';
import { JWTModule } from 'src/jwt.module';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [JWTModule, UsersModule],
  exports: [AuthGuard],
  providers: [AuthGuard],
})
export class GuardModule {}
