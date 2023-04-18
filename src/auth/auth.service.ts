import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginEmailDto } from './dto/login-email.dto';
import { User } from 'src/users/schemas/user.schema';
const bcrypt = require('bcryptjs');
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { responseData, responseMessage } from 'src/utils/responseData';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private rolesService: RolesService,
  ) {}

  async loginWithEmail(loginEmailDto: LoginEmailDto) {
    this.logger.log(`Request to login with email: ${loginEmailDto.email}`);
    const user = await this.usersService.findOneByEmail(loginEmailDto.email);
    if (!user) throw new HttpException(`User not found`, HttpStatus.OK);
    const match = await this.comparePassword(
      loginEmailDto.password,
      user.password,
    );
    if (!match)
      throw new HttpException('Password is not correct.', HttpStatus.OK);

    if (!user.emailVerified) {
      throw new HttpException(
        'Email is not verified, please verify your email first!',
        HttpStatus.OK,
      );
    }

    return this.generateToken(user);
  }
  async register(registerDto: RegisterDto) {
    this.logger.log(`Request to register with address: ${registerDto.address}`);
    const createUserDto = new CreateUserDto();
    createUserDto.address = registerDto.address;
    createUserDto.name = registerDto.name;
    createUserDto.email = registerDto.email;
    createUserDto.emailVerified = true;
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

  async generateToken(user: User) {
    const roles = user.roles.map((item) => item.code);
    const access_token = this.jwtService.sign({ email: user.email, roles });
    return responseData({ access_token }, '');
  }
}
