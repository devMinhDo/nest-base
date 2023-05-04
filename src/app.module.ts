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
import { CustomersModule } from 'src/customer/customers.module';
import { TaskModule } from 'src/task/task.module';
import { ProjectsModule } from './project/projects.module';
import { ProjectTaskModule } from './project-task/project-task.module';
import { ProjectUserModule } from 'src/project-user/project-user.module';
import { MyTimeSheetModule } from './my-time-sheet/my-time-sheet.module';
import { TimeKeepModule } from './time-keep/time-keep.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    DatabaseModule,
    AuthModule,
    UsersModule,
    RolesModule,
    SessionModule,
    ConfigurationModule,
    CustomersModule,
    TaskModule,
    ProjectsModule,
    ProjectTaskModule,
    ProjectUserModule,
    MyTimeSheetModule,
    TimeKeepModule,
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
