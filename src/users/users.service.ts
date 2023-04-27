import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RolesService } from 'src/roles/roles.service';
import { responseData, responseMessage } from 'src/utils/responseData';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoles } from 'src/users/constant/user-role.constant';
import { UserStatus } from './constant/user-status.constant';
import { User, UserDocument } from './schemas/user.schema';
import { BaseResDto } from '../config/dto/base-res.dto';
import { GetAllUserDto } from './dto/get-all-user.dto';
const bcrypt = require('bcryptjs');
import { filterOptions } from '../utils/filterText';
import { TEXT_SEARCH_USER } from './constant/text-search.constant';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';
import { responseError } from '../utils/responseData';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private rolesService: RolesService,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {
    this.initUser();
  }

  async initUser() {
    const findUser = await this.userModel.find();
    if (findUser.length < 20) {
      const data = [
        {
          name: 'Tien Pham',
          emailAddress: 'admin12',
          password: '123123123',
          isActive: true,
          type: 0,
          jobTitle: null,
          level: 15,
          userCode: null,
          avatarPath: '/avatars/1632474098451_1_tien.pham.jpg',
          branch: null,
          id: 1000,
        },
        {
          name: 'Tien Nguyen Huu',
          emailAddress: 'admin21',
          password: '123123123',
          isActive: true,
          type: 0,
          jobTitle: null,
          level: 15,
          userCode: null,
          avatarPath: '',
          branch: null,
          id: 51,
        },
        {
          name: 'Thai Bui Minh',
          emailAddress: 'admin31',
          password: '123123123',
          isActive: true,
          type: 0,
          jobTitle: null,
          level: 14,
          userCode: null,
          avatarPath: '',
          branch: null,
          id: 101,
        },
        {
          name: 'duong nghi viec giua thang 5',
          emailAddress: 'admin41',
          password: '123123123',
          isActive: true,
          type: 0,
          jobTitle: null,
          level: 9,
          userCode: null,
          avatarPath: '',
          branch: null,
          id: 211,
        },
        {
          name: 'duong nghi viec giua thang 5',
          emailAddress: 'admin511',
          password: '123123123',
          isActive: true,
          type: 0,
          jobTitle: null,
          level: 9,
          userCode: 'acsdc',
          avatarPath: '',
          branch: null,
          id: 221,
        },
        {
          name: 'NCCOP Sir',
          emailAddress: 'admin61',
          password: '123123123',
          isActive: true,
          type: 0,
          jobTitle: null,
          level: 10,
          userCode: null,
          avatarPath: '',
          branch: null,
          id: 231,
        },
        {
          name: 'Bui Lam',
          emailAddress: 'admin71',
          password: '123123123',
          isActive: true,
          type: 0,
          jobTitle: null,
          level: 5,
          userCode: '',
          avatarPath: '',
          branch: null,
          id: 241,
        },
        {
          name: 'Uno VATest',
          emailAddress: 'admin81',
          password: '123123123',
          isActive: true,
          type: 0,
          jobTitle: null,
          level: 9,
          userCode: null,
          avatarPath: '',
          branch: null,
          id: 481,
        },
        {
          name: 'duong duong',
          emailAddress: 'admin91',
          password: '123123123',
          isActive: true,
          type: 0,
          jobTitle: null,
          level: 0,
          userCode: null,
          avatarPath: '',
          branch: null,
          id: 841,
        },
        {
          name: 'thao1212 thaoo',
          emailAddress: 'admin221',
          password: '123123123',
          isActive: true,
          type: 0,
          jobTitle: null,
          level: 0,
          userCode: null,
          avatarPath: '',
          branch: null,
          id: 931,
        },
        {
          name: 'thy phan',
          emailAddress: 'admin101',
          password: '123123123',
          isActive: true,
          type: 0,
          jobTitle: null,
          level: 6,
          userCode: 'thy11',
          avatarPath: '',
          branch: null,
          id: 1181,
        },
        {
          name: 'Dai Trinh',
          emailAddress: 'admin111',
          password: '123123123',
          isActive: true,
          type: 0,
          jobTitle: null,
          level: null,
          userCode: null,
          avatarPath: '',
          branch: null,
          id: 1811,
        },
        {
          name: 'hien pm1',
          emailAddress: 'admin2111',
          password: '123123123',
          isActive: true,
          type: 0,
          jobTitle: null,
          level: 7,
          userCode: null,
          avatarPath: '',
          branch: null,
          id: 21911,
        },
      ];
      await this.userModel.insertMany(data);
    }
  }
  async findAll() {
    const findQuery = await this.userModel
      .find({})
      .select(
        'name emailAddress isActive type jobTitle level userCode avatarPath avatarFullPath branch branchColor branchDisplayName branchId id',
      );
    return {
      ...BaseResDto,
      result: findQuery,
    };
  }

  async getAllPagging(getAllUserDto: GetAllUserDto) {
    const {
      sort,
      sortDirection,
      searchText,
      skipCount,
      maxResultCount,
      filterItems,
    } = getAllUserDto;
    const { items, totalCount } = await filterOptions(
      sort,
      sortDirection,
      filterItems,
      searchText,
      skipCount,
      maxResultCount,
      this.userModel,
      TEXT_SEARCH_USER,
    );
    return {
      ...BaseResDto,
      result: {
        totalCount,
        items,
      },
    };
  }

  async getAllManger() {
    const items = await this.userModel.find({ managerId: { $ne: 0 } });
    return {
      ...BaseResDto,
      result: items,
    };
  }

  async getRoles() {
    const result = await this.rolesService.getRole();
    return {
      ...BaseResDto,
      result: {
        items: result,
      },
    };
  }

  async createUser(createUserAdminDto: CreateUserAdminDto) {
    const findUser = await this.userModel.findOne({
      $or: [
        { emailAddress: createUserAdminDto.emailAddress },
        { userName: createUserAdminDto.userName },
      ],
    });
    if (findUser) {
      return responseError(
        `Username or email is exits`,
        `Username or email is already exist!`,
      );
    }
    createUserAdminDto.roleNames = await this.rolesService.getRoleId(
      createUserAdminDto[`roleNames`],
    );
    createUserAdminDto.password = await this.authService.hashPassword(
      createUserAdminDto[`password`],
    );
    const lastUserID = await this.userModel.findOne({}).sort({ id: -1 });

    createUserAdminDto.id = lastUserID.id + 1;

    const createUser = await this.userModel.create(createUserAdminDto);
    return {
      ...BaseResDto,
      result: createUser,
    };
  }
  async getUser(Id: number) {
    const result = await this.userModel.findOne({ id: Id }).select('-password');
    return {
      ...BaseResDto,
      result: result,
    };
  }

  async updateUser(createUserAdminDto: CreateUserAdminDto) {
    const findUser = await this.userModel.findOne({
      id: createUserAdminDto.id,
    });
    if (!findUser) return responseError(`User not found`, `User not found`);
    delete createUserAdminDto.password;
    createUserAdminDto.roleNames = await this.rolesService.getRoleId(
      createUserAdminDto[`roleNames`],
    );
    const newUser = await this.userModel.findOneAndUpdate(
      { id: createUserAdminDto.id },
      createUserAdminDto,
      { new: true },
    );
    return {
      ...BaseResDto,
      result: newUser,
    };
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
    const user = await this.userModel.findOne(filter).populate('roleNames');
    return user;
  }

  async findOneWithCondition(filter: any) {
    return await this.userModel.findOne(filter).populate('roleNames');
  }

  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Request to create user: ${createUserDto.address}`);
    const createDto = await this.setDefaultRole(createUserDto);
    if (createUserDto.emailAddress)
      await this.checkIsExistedEmail(createUserDto.emailAddress);

    const data = await this.userModel.create(createDto);
    return data;
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
    updateUserDto.roleNames = roles;

    if (updateUserDto.password)
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);

    if (
      updateUserDto.emailAddress &&
      updateUserDto.emailAddress !== user.emailAddress
    ) {
      await this.checkIsExistedEmail(updateUserDto.emailAddress);
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
    console.log(userDto);
    delete userDto['_doc'].password;
    return userDto;
  }

  async setDefaultRole(createUserDto: CreateUserDto) {
    const user: any = createUserDto;
    const role = await this.rolesService.findByCode(UserRoles.USER);
    user.roleNames = [role];
    return user;
  }

  async updateOneByCondition(condition: any, data: any) {
    await this.userModel.updateOne(condition, data);
  }
}
