import { ApiProperty } from '@nestjs/swagger';
import { TypeOfWork } from '../constant/type-of-work.constant';
import { TimeSheetStatus } from '../constant/time-sheet-status.constant';

export class CreateDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  projectTaskId: number;

  @ApiProperty()
  note: string;

  @ApiProperty()
  workingTime: number;

  @ApiProperty()
  targetUserWorkingTime: number;

  @ApiProperty()
  typeOfWork: TypeOfWork;

  @ApiProperty()
  isCharged: boolean;
  @ApiProperty()
  emailVerified = false;
  @ApiProperty()
  dateAt: string | number;

  @ApiProperty()
  status: TimeSheetStatus;

  @ApiProperty()
  projectTargetUserId: number;
  @ApiProperty()
  userId: number;
}
