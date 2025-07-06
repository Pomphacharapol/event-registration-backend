import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export default new ValidationPipe({
  transform: true,
  whitelist: true,
  exceptionFactory: (errors: ValidationError[]) =>
    new BadRequestException(errors),
});
