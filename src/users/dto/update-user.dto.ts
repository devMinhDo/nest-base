import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { UserStatus } from '../constant/user-status.constant';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsMongoId()
  _id: string;

  @ApiProperty()
  status: UserStatus;

  @ApiProperty()
  roleCodes: string[];
}
