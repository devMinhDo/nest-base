// import { Injectable, CanActivate, ExecutionContext, HttpException , HttpStatus, forwardRef, Inject, Global } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from 'src/users/users.service';
//
// @Injectable()
// export class AuthGuard implements CanActivate {
//
//   constructor(
//     private jwtService: JwtService,
//     private usersService: UsersService
//   ) { }
//
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request: any = context.switchToHttp().getRequest();
//     const header = request.header('Authorization');
//     if (!header) {
//       throw new HttpException('Authorization: Bearer <token> header missing', HttpStatus.UNAUTHORIZED);
//     }
//     const parts = header.split(' ');
//     if (parts.length !== 2 && parts[0] !== 'Bearer') {
//       throw new HttpException('Authorization: Bearer <token> header invalid', HttpStatus.UNAUTHORIZED);
//     }
//
//     const token = parts[1];
//
//     try {
//       const decoded = await this.jwtService.verify(token);
//       const user = await this.usersService.findOne({ address: decoded.address });
//       request.user = user;
//       request.roles = decoded.roles;
//       if (user) return true;
//     } catch (e) {
//       throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
//     }
//   }
// }
