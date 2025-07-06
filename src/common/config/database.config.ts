import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface DatabaseConfig {
  connectionString: string;
  userPassword: string;
}

export default registerAs('database-config', (): DatabaseConfig => {
  const values: DatabaseConfig = {
    connectionString: process.env.DB_CONNECTION_STRING,
    userPassword: process.env.DB_USER_PASSWORD,
  };

  const schema = Joi.object<DatabaseConfig, true>({
    connectionString: Joi.string().required(),
    userPassword: Joi.string().required(),
  });

  const validateResult = schema.validate(values, { abortEarly: false });
  if (validateResult.error) {
    throw new Error(validateResult.error.message);
  }

  return values;
});
