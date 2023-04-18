import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoles } from './constant/user-role.constant';
import { UsersService } from './users.service';
import { Roles } from 'src/guard/roles.decorator';
import { RolesGuard } from '../guard/roles.guard';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('/get-all')
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/get-one/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Post('/update')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Post('/delete/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
