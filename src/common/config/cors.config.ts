import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface CorsConfig {
  allowedHeaders: string;
  exposedHeaders: string;
  methods: string;
  origin: string | string[];
}

export default registerAs('cors-config', (): CorsConfig => {
  const values: CorsConfig = {
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS,
    exposedHeaders: process.env.CORS_EXPOSED_HEADERS,
    methods: process.env.CORS_METHODS,
    origin: process.env.CORS_ORIGIN.includes(',')
      ? process.env.CORS_ORIGIN.split(',')
      : process.env.CORS_ORIGIN,
  };

  const schema = Joi.object<CorsConfig, true>({
    allowedHeaders: Joi.string().required(),
    exposedHeaders: Joi.string().required(),
    methods: Joi.string().required(),
    origin: Joi.alternatives()
      .try(Joi.array().items(Joi.string()), Joi.string())
      .required(),
  });

  const validateResult = schema.validate(values, { abortEarly: false });
  if (validateResult.error) {
    throw new Error(validateResult.error.message);
  }

  return values;
});
