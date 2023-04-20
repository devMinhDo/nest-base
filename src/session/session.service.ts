import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RolesService } from '../roles/roles.service';
import { UserResDTO } from '../users/dto/user-res.dto';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor() {}

  async getCurrentLoginInformation(req: any, res) {
    if (req.headers['authorization'] === undefined)
      return res.status(200).json({
        ...UserResDTO,
      });
  }
}
