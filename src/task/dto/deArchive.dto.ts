import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeArchiveDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;
}
