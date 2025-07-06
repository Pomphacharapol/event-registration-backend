import { Type } from '@nestjs/common';

export type ApiPaginatedTemplateResponseOptions = {
  model: Type<any>;
  description?: string;
};
