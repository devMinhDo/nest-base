import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserStatus } from '../users/constant/user-status.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();
    const header = request.header('Authorization');
    if (!header) {
      throw new HttpException(
        'Authorization: Bearer <token> header missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const parts = header.split(' ');
    if (parts.length !== 2 && parts[0] !== 'Bearer') {
      throw new HttpException(
        'Authorization: Bearer <token> header invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = parts[1];
    console.log(token);

    try {
      const decoded = await this.jwtService.verify(token);
      console.log('check decoded', decoded);
      const user = await this.usersService.findOne({
        emailAddress: decoded.email,
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }
      if (user.status === UserStatus.DISABLE) {
        throw new HttpException(
          'Account your have block!',
          HttpStatus.UNAUTHORIZED,
        );
      }
      request.user = user;
      request.roles = decoded.roles;
      if (user) return true;
    } catch (e) {
      console.log(e.message);
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
