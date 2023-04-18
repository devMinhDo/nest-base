import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from 'src/users/constant/user-role.constant';
import { ROLES_KEY } from './roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserStatus } from '../users/constant/user-status.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
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
    const decoded = await this.jwtService.verify(token);
    const user = await this.usersService.findOne({
      email: decoded.email,
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
    const { roles } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => roles?.includes(role));
  }
}
