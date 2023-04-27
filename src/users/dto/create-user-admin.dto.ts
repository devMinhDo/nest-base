import {
  IsBoolean,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Branch } from '../constant/branch.constant';
import { Level } from '../constant/level.constant';
import { Sex } from '../constant/sex.constant';
import { UserType } from '../constant/user-type.constant';
import { Role } from '../../roles/schema/role.schema';

export class CreateUserAdminDto {
  id: number;

  @IsString()
  readonly userName: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly surname: string;

  fullName: string;

  @IsString()
  readonly emailAddress: string;

  @IsString()
  readonly phoneNumber: string;

  @IsString()
  readonly address: string;

  @IsBoolean()
  readonly isActive: boolean;

  readonly isStopWork: boolean;

  @IsOptional()
  @IsString({ each: true })
  roleNames: Role[];

  password: string;

  @IsEnum(UserType)
  readonly type: UserType;

  readonly jobTitle: string;

  @IsEnum(Level)
  readonly level: Level;

  @IsNumber()
  readonly allowedLeaveDay: number;

  @IsDateString()
  readonly startDateAt: string;

  @IsNumber()
  readonly salary: number;

  @IsDateString()
  readonly salaryAt: string;

  readonly userCode: string;

  readonly managerId: number;

  @IsEnum(Branch)
  readonly branch: Branch;

  @IsEnum(Sex)
  readonly sex: Sex;

  readonly morningWorking: string;

  readonly morningStartAt: string;

  readonly morningEndAt: string;

  readonly afternoonWorking: string;

  readonly afternoonStartAt: string;

  readonly afternoonEndAt: string;

  readonly isWorkingTimeDefault: boolean;

  readonly registerWorkDay: string;

  readonly avatarPath: string;
}
