import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/roles/schema/role.schema';

export class CreateUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform((address) => address.value.toLowerCase())
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  emailVerified = false;
  roleNames: Role[];

  @ApiProperty()
  @IsNotEmpty()
  sex: number;
}
