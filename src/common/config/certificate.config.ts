import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface CertificateConfig {
  key: string;
  cert: string;
  passphrase: string;
}

const isHttpsEnabled = process.env.APP_HTTPS_ENABLE === 'true';

export default registerAs('certificate-config', (): CertificateConfig => {
  const values: CertificateConfig = {
    key: process.env.SSL_CERTIFICATE_KEY_PATH,
    cert: process.env.SSL_CERTIFICATE_CERT_PATH,
    passphrase: process.env.SSL_CERTIFICATE_PASSPHRASE_KEY,
  };

  const schema = Joi.object<CertificateConfig, true>({
    cert: Joi.string().when(Joi.ref('$isHttpsEnabled'), {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    key: Joi.string().when(Joi.ref('$isHttpsEnabled'), {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    passphrase: Joi.string().when(Joi.ref('$isHttpsEnabled'), {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  });

  const validateResult = schema.validate(values, {
    abortEarly: false,
    context: { isHttpsEnabled },
  });

  if (validateResult.error) {
    throw new Error(validateResult.error.message);
  }

  return values;
});
