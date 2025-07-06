import { SetMetadata } from '@nestjs/common';

export const IGNORE_TRANSFORM_TEMPLATE_RESPONSE =
  'ignore_transform_template_response';

export const IgnoreTransformTemplateResponse = () =>
  SetMetadata(IGNORE_TRANSFORM_TEMPLATE_RESPONSE, true);
