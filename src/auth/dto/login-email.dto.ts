import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  userNameOrEmailAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  rememberClient: boolean;
}
