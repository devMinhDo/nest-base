const envVars = process.env;

require('dotenv').config();
const TESTNET: boolean = ['1', 'true', 'TRUE'].includes(envVars.TESTNET);

export const config = {
  PORT: envVars.PORT,
  database: {
    MONGODB_URI: TESTNET ? envVars.MONGODB_URI + '-beta' : envVars.MONGODB_URI,
    MYSQL_PORT: String(envVars.MYSQL_PORT),
    MYSQL_USERNAME: envVars.MYSQL_USERNAME,
    MYSQL_DATABASE: envVars.MYSQL_DATABASE,
  },
  jwt: {
    JWT_SECRET_KEY: envVars.JWT_SECRET_KEY,
    JWT_EXPIRES_TIME: envVars.JWT_EXPIRES_TIME,
  },
  TESTNET,
};
