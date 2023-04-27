import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { FilterItemsInterface } from '../interface/filter-items.interface';

export class GetAllUserDto {
  @ApiProperty()
  sort: string;

  @ApiProperty()
  sortDirection: number;

  @ApiProperty()
  filterItems: FilterItemsInterface[];

  @ApiProperty()
  searchText: number;

  @ApiProperty()
  skipCount: number;

  @ApiProperty()
  maxResultCount: number;
}
