import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseStatusDto, ResponseTemplateDto } from '../../dto';
import { ApiTemplateResponseOptions } from './types';

export const ApiOkBooleanTemplateResponse = (
  options: ApiTemplateResponseOptions,
) => {
  return applyDecorators(
    ApiExtraModels(ResponseTemplateDto),
    ApiOkResponse({
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseTemplateDto) },
          {
            properties: {
              status: {
                $ref: getSchemaPath(ResponseStatusDto),
              },
              data: {
                description: 'Boolean value indicating success',
                enum: [true, false],
                type: 'boolean',
              },
            },
          },
        ],
      },
    }),
  );
};
