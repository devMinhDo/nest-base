import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/roles/schema/role.schema';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform((address) => address.value.toLowerCase())
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  emailVerified = false;
  roles: Role[];
}
