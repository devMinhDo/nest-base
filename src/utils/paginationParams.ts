import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationParams {
  @ApiProperty({ required: false })
  @Type(() => Number)
  page: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({ required: false })
  sortBy: string;
}
