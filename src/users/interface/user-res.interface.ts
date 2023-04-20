import { BaseResInterface } from '../../config/interface/base-res.interface';
export interface UserResInterface extends BaseResInterface {
  result: {
    application: {
      version: string;
      releaseDate: string;
      features: object;
    };
  };
  user: object | null;
  tenant: null;
}
