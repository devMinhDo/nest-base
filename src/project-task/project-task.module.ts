import { Module } from '@nestjs/common';
import { ProjectTaskService } from './project-task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectTask, ProjectTaskSchema } from './schemas/project-task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectTask.name, schema: ProjectTaskSchema },
    ]),
  ],
  exports: [ProjectTaskService],
  controllers: [],
  providers: [ProjectTaskService],
})
export class ProjectTaskModule {}
