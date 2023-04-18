import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from './config/config';

@Module({
  imports: [
    {
      ...JwtModule.register({
        secret: config.jwt.JWT_SECRET_KEY,
        signOptions: { expiresIn: config.jwt.JWT_EXPIRES_TIME },
      }),
      global: true,
    },
  ],
  exports: [JwtModule],
})
export class JWTModule {}
