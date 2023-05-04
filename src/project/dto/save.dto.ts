import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SaveDto {
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  status: number;
  @ApiProperty()
  timeStart: Date;

  @ApiProperty()
  timeEnd: Date;

  @ApiProperty()
  note: string;

  @ApiProperty()
  projectType: number;

  @ApiProperty()
  customerId: number;

  @ApiProperty()
  projectTargetUsers: Array<any>;

  @ApiProperty()
  isAllUserBelongTo: boolean;

  tasks: any[];

  users: any[];
}
