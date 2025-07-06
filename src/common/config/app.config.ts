import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface AppConfig {
  apiDocEnabled: boolean;
  appDomain: string;
  appName: string;
  description: string;
  httpsEnabled: boolean;
  nodeEnv: string;
  port: number;
  prefixHttp: string;
  responseErrorMeta: boolean;
  responseErrorStacktrace: boolean;
  serviceName: string;
  swaggerApiBasePath: string;
}

export default registerAs('app-config', (): AppConfig => {
  const values: AppConfig = {
    apiDocEnabled: process.env.APP_API_DOC_ENABLE === 'true',
    appDomain: process.env.APP_DOMAIN,
    appName: process.env.APP_NAME,
    description: process.env.APP_DESCRIPTION,
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.APP_PORT),
    prefixHttp: process.env.PREFIX_HTTP || 'api/v1/',
    responseErrorMeta: process.env.APP_RESPONSE_ERROR_META === 'true',
    responseErrorStacktrace:
      process.env.APP_RESPONSE_ERROR_STACKTRACE === 'true',
    serviceName: process.env.APP_SERVICE_NAME,
    swaggerApiBasePath: process.env.SWAGGER_API_BASE_PATH || '/',
    httpsEnabled: process.env.APP_HTTPS_ENABLE === 'true',
  };

  const schema = Joi.object<AppConfig, true>({
    apiDocEnabled: Joi.boolean(),
    appDomain: Joi.string().required(),
    appName: Joi.string().required(),
    description: Joi.string().required(),
    nodeEnv: Joi.string()
      .required()
      .valid('dev', 'prod', 'test', 'local', 'uat', 'sit'),
    port: Joi.number().default(3000),
    prefixHttp: Joi.string().required(),
    responseErrorMeta: Joi.boolean(),
    responseErrorStacktrace: Joi.boolean(),
    serviceName: Joi.string().required(),
    swaggerApiBasePath: Joi.string().required(),
    httpsEnabled: Joi.boolean(),
  });

  const validateResult = schema.validate(values, { abortEarly: false });
  if (validateResult.error) {
    throw new Error(validateResult.error.message);
  }

  return values;
});
