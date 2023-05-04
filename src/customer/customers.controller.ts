import { Body, Controller, HttpCode, Post, Delete, Get } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAllUserDto } from '../users/dto/get-all-user.dto';
import { SaveDto } from './dto/save.dto';
@ApiBearerAuth()
@ApiTags('services/app/Customer')
@Controller('services/app/Customer')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @HttpCode(200)
  @Post('GetAllPagging')
  async getAllPagination(@Body() getAllUserDto: GetAllUserDto) {
    return this.customersService.getAllPagination(getAllUserDto);
  }

  @HttpCode(200)
  @Get('GetAll')
  async getAll() {
    return this.customersService.getAll();
  }

  @HttpCode(200)
  @Post('Save')
  async save(@Body() saveDto: SaveDto) {
    return this.customersService.save(saveDto);
  }

  // @HttpCode(200)
  // @Delete('Save')
  // async save(@Body() saveDto: SaveDto) {
  //   return this.customersService.save(saveDto);
  // }
}
