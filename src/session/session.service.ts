import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RolesService } from '../roles/roles.service';
import { UserResDTO } from '../users/dto/user-res.dto';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config/config';
import { responseError } from 'src/utils/responseData';
@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async getCurrentLoginInformation(req: any, res) {
    if (req.headers['authorization'] === undefined)
      return res.status(200).json({
        ...UserResDTO,
      });
    const token = req.headers['authorization'].split(' ')[1];
    const { email } = await this.jwtService.verify(token);
    console.log('email', email);
    const user = await this.usersService.findOne({
      emailAddress: email,
    });
    if (!user)
      return res
        .status(401)
        .json(responseError('Your request is not valid!', 'Invalid token'));

    delete user['password'];

    return res.status(200).json({
      ...UserResDTO,
      result: {
        ...UserResDTO.result,
        user,
      },
    });
  }
}
