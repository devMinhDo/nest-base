import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginEmailDto } from './dto/login-email.dto';
import { User } from 'src/users/schemas/user.schema';
const bcrypt = require('bcryptjs');
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { responseData, responseMessage } from 'src/utils/responseData';
import { RolesService } from '../roles/roles.service';
import { UserStatus } from '../users/constant/user-status.constant';
import { LOGIN_FAILED } from './dto/login-failed.dto';
import { ACCOUNT_LOCK } from './dto/account-lock.dto';
import { BaseResDto } from '../config/dto/base-res.dto';
import { AuthResultDto } from './dto/auth-result.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private rolesService: RolesService,
  ) {}

  async loginWithEmail(loginEmailDto: LoginEmailDto, res) {
    const { userNameOrEmailAddress, password, rememberClient } = loginEmailDto;
    const user = await this.usersService.findOneByEmail(userNameOrEmailAddress);
    if (!user) return LOGIN_FAILED;
    if (user.status === UserStatus.DISABLE) {
      return res.status(500).json(ACCOUNT_LOCK);
    }
    const match = await this.comparePassword(password, user.password);
    if (!match) return res.status(500).json(ACCOUNT_LOCK);
    const accessToken = await this.generateToken(user, rememberClient);
    console.log(accessToken);
    return res.status(200).json({
      ...BaseResDto,
      result: {
        ...AuthResultDto,
        accessToken: accessToken,
        userId: user._id,
      },
    });
  }
  async register(registerDto: RegisterDto) {
    this.logger.log(`Request to register with address: ${registerDto.address}`);
    const findUser = await this.usersService.findOne({});
    const createUserDto = new CreateUserDto();

    if (!findUser) {
      createUserDto.id = 1;
    } else {
      createUserDto.id = findUser.id + 1;
    }
    createUserDto.address = registerDto.address;
    createUserDto.name = registerDto.name;
    createUserDto.emailAddress = registerDto.email;
    createUserDto.emailVerified = true;
    createUserDto.sex = registerDto.sex;
    const hashPassword = await this.hashPassword(registerDto.password);
    createUserDto.password = hashPassword;
    await this.usersService.create(createUserDto);
    return responseMessage('Registered successfully', true);
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
  async comparePassword(password: string, storePasswordHash: string) {
    return await bcrypt.compare(password, storePasswordHash);
  }

  async generateToken(user: User, rememberClient: boolean) {
    const roles = user.roleNames.map((item) => item.name);
    const access_token = this.jwtService.sign({
      email: user.emailAddress,
      roles,
      rememberClient,
    });
    return access_token;
  }
}
