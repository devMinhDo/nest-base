import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoles } from './constant/user-role.constant';
import { UsersService } from './users.service';
import { Roles } from 'src/guard/roles.decorator';
import { RolesGuard } from '../guard/roles.guard';
import { GetAllUserDto } from './dto/get-all-user.dto';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';

@ApiBearerAuth()
@ApiTags('services/app/User')
@Controller('services/app/User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('/GetUserNotPagging')
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post('GetAllPagging')
  getAllPagging(@Body() getAllUserDto: GetAllUserDto) {
    return this.usersService.getAllPagging(getAllUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('GetRoles')
  getRoles() {
    return this.usersService.getRoles();
  }

  @UseGuards(AuthGuard)
  @Get('/GetAllManager')
  getAllManager() {
    return this.usersService.getAllManger();
  }

  @UseGuards(AuthGuard)
  @Post('/create')
  create(@Body() createUserAdminDto: CreateUserAdminDto) {
    return this.usersService.createUser(createUserAdminDto);
  }

  @UseGuards(AuthGuard)
  @Get('/get')
  get(@Query('Id') Id: number) {
    return this.usersService.getUser(Id);
  }

  @UseGuards(AuthGuard)
  @Put('/Update')
  Update(@Body() createUserAdminDto: CreateUserAdminDto) {
    return this.usersService.updateUser(createUserAdminDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Post('/delete/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
