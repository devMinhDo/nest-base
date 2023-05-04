import { Module } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { ProjectUserController } from './project-user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectUser, ProjectUserSchema } from './schemas/project-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectUser.name, schema: ProjectUserSchema },
    ]),
  ],
  exports: [ProjectUserService],
  controllers: [ProjectUserController],
  providers: [ProjectUserService],
})
export class ProjectUserModule {}
