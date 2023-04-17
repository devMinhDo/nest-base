import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from '../config/config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: Number(config.database.MYSQL_PORT),
  username: config.database.MYSQL_USERNAME,
  database: config.database.MYSQL_DATABASE,
  entities: [`dist/**/*.entity.js`],
  migrations: [`dist/migrations/*{.ts,.js}`],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
