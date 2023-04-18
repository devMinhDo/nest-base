import { HttpStatus } from '@nestjs/common';

export const responseData = (data: any = [], message = '') => {
  return { data, message, status: true };
};

export const responseMessage = (message: string, status: boolean) => {
  return { message, status };
};
