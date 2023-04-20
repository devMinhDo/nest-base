import { BaseResInterface } from '../config/interface/base-res.interface';
import { BaseErrorInterface } from '../config/interface/base-error.interface';
import { BaseResDto } from '../config/dto/base-res.dto';
export const responseData = (data: any = [], message = '') => {
  return { data, message, status: true };
};

export const responseMessage = (message: string, status: boolean) => {
  return { message, status };
};

export const responseResult = (data): BaseResInterface => {
  return {
    result: data,
    targetUrl: null,
    success: true,
    error: null,
    unAuthorizedRequest: false,
    __abp: true,
  };
};

export const responseError = (
  message: string | null = null,
  details: string | null = null,
): BaseErrorInterface => {
  return {
    ...BaseResDto,
    error: {
      code: 0,
      message,
      details,
      validationErrors: null,
    },
    success: false,
  };
};
