import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetAllDto {
  @ApiProperty()
  @IsNotEmpty()
  status: number;

  @ApiProperty()
  search: string;
}
