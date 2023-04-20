import { BaseResInterface } from './base-res.interface';

export interface BaseErrorInterface extends BaseResInterface {
  error: {
    code: number;
    message: string;
    details: string | null;
    validationErrors: Array<object> | null;
  };
}
