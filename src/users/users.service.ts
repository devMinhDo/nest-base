import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RolesService } from 'src/roles/roles.service';
import { responseData, responseMessage } from 'src/utils/responseData';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoles } from 'src/users/constant/user-role.constant';
import { UserStatus } from './constant/user-status.constant';
import { User, UserDocument } from './schemas/user.schema';
import { LOGIN_FAILED } from '../auth/dto/login-failed.dto';
const bcrypt = require('bcryptjs');

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private rolesService: RolesService,
  ) {}
  async findAll() {
    const findQuery = this.userModel
      .find({})
      .select('-password')
      .populate('roles');

    const results = await findQuery;
    return responseData(results, '');
  }

  async findOneById(id: string) {
    this.logger.log(`Request to find user by id: ${id}`);
    const data = await this.userModel
      .findOne({ _id: id })
      .populate('roleNames');
    return responseData(data, 'Found a user');
  }

  async findOneByEmail(email: string) {
    // this.logger.log(`Request to find user by email: ${email}`);
    const user = await this.userModel
      .findOne({ emailAddress: email })
      .populate('roleNames');
    if (!user)
      throw new HttpException(
        `User not exist with email: ${email} `,
        HttpStatus.OK,
      );
    return user;
  }

  async findOneByAddress(address: string) {
    // this.logger.log(`Request to find user by address: ${address}`);
    const user = await this.userModel
      .findOne({ address })
      .populate('sponsor')
      .populate({ path: 'roles', select: '_id, code' });
    if (!user)
      throw new HttpException(
        `User not exist with address: ${address} `,
        HttpStatus.OK,
      );
    return user;
  }

  async findOneUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).select('-password');
    if (!user) {
      return null;
    }
    return user;
  }

  async findOne(filter: any) {
    //this.logger.log(`Request to find one user`);
    const user = await this.userModel.findOne(filter).populate('roles');
    return this._toUserDto(user);
  }

  async findOneWithCondition(filter: any) {
    return await this.userModel.findOne(filter).populate('sponsor');
  }

  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Request to create user: ${createUserDto.address}`);
    const createDto = await this.setDefaultRole(createUserDto);

    if (createUserDto.email)
      await this.checkIsExistedEmail(createUserDto.email);

    const data = await this.userModel.create(createDto);
    return this._toUserDto(data);
  }

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(updateUserDto._id);
    console.log('check user: ', user);
    if (!user) throw new HttpException('Not found user', HttpStatus.OK);

    const roles = [];
    if (updateUserDto.roleCodes?.length > 0) {
      for (const code of updateUserDto.roleCodes) {
        const role = await this.rolesService.findByCode(code);
        roles.push(role);
      }
    }
    updateUserDto.roles = roles;

    if (updateUserDto.password)
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);

    if (updateUserDto.email && updateUserDto.email !== user.emailAddress) {
      await this.checkIsExistedEmail(updateUserDto.email);
    }

    delete updateUserDto.roleCodes;

    const res = await this.userModel.updateOne(
      { _id: updateUserDto._id },
      updateUserDto,
    );
    if (res.modifiedCount) return responseMessage('Updated successfully', true);
    return responseMessage('Update fail', false);
  }

  async remove(id: string) {
    this.logger.log(`Request to remove user: ${id}`);
    const user = await this.userModel.findById(id);
    user.status = UserStatus.DISABLE;
    user.save();
    return responseMessage('Disabled successfully', true);
  }

  async checkIsExistedEmail(email: string) {
    const user = await this.userModel.findOne({ email: email });
    console.log('user', user);
    if (!user) return true;
    else throw new HttpException('Email is existed', HttpStatus.OK);
  }

  async _toUserDto(userDto: any) {
    delete userDto['_doc'].password;
    return userDto;
  }

  async setDefaultRole(createUserDto: CreateUserDto) {
    const user: any = createUserDto;
    const role = await this.rolesService.findByCode(UserRoles.USER);
    user.roles = [role];
    return user;
  }

  async updateOneByCondition(condition: any, data: any) {
    await this.userModel.updateOne(condition, data);
  }
}
