import { UserResInterface } from '../interface/user-res.interface';
import { VERSION } from 'src/config/constant/version.constant';

export const UserResDTO: UserResInterface = {
  result: {
    application: {
      version: VERSION.version,
      releaseDate: VERSION.releaseDate,
      features: {
        additionalProp1: true,
        additionalProp2: true,
        additionalProp3: true,
      },
    },
  },
  user: null,
  tenant: null,
  targetUrl: null,
  success: true,
  error: null,
  unAuthorizedRequest: false,
  __abp: true,
};
