/* eslint-disable prettier/prettier */

import { readFileSync } from 'fs';
import { DataSource } from 'typeorm';
import { injectableDotEnvironment } from './src/common/util';

const env = process.env.NODE_ENV;
injectableDotEnvironment(env);

let extra = {};
if (env !== 'local' && env !== 'test') {
  extra = {
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

const userPassword = readFileSync(process.env.DB_USER_PASSWORD, {
  encoding: 'utf8',
});
const connectionString = process.env.DB_CONNECTION_STRING.replace(
  '${db-user-password}',
  function () {
    return userPassword;
  },
);

export default new DataSource({
  type: 'postgres',
  url: connectionString,
  entities: ['./src/**/*.entity.ts'],
  migrations: ['./src/migrations/*.ts'],
  extra: extra,
});
