import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllExceptionFilter } from './http-exception.filter';
import { dataSourceOptions } from './database/database.module';
import { DatabaseModule } from './database/mongoDB.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { SessionModule } from './session/session.module';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    DatabaseModule,
    AuthModule,
    UsersModule,
    RolesModule,
    SessionModule,
    ConfigurationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
