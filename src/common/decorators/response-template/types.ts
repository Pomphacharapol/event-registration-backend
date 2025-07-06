import { HttpStatus, Type } from '@nestjs/common';

export type ApiTemplateResponseOptions = {
  model?: Type<any>;
  description?: string;
  httpStatus?: HttpStatus;
};
