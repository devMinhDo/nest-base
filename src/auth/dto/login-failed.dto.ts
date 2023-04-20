import { responseError } from 'src/utils/responseData';
export const LOGIN_FAILED = responseError(
  'Login failed!',
  'Invalid user name or password',
);
