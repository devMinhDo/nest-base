import { config } from '../../config/config';
export const AuthResultDto = {
  accessToken: null,
  encryptedAccessToken: 'thisisomerandomtext',
  expireInSeconds: config.jwt.JWT_EXPIRES_TIME,
  userId: null,
};
