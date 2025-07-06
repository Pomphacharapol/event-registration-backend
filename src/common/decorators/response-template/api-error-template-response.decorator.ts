import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseTemplateDto } from '../../dto';
import { ApiTemplateResponseOptions } from './types';

// Tutorial create controller decorator for swagger api generic type
// https://pietrzakadrian.com/blog/how-to-create-pagination-in-nestjs-with-typeorm-swagger

export const ApiErrorTemplateResponse = (
  options: ApiTemplateResponseOptions,
) => {
  return applyDecorators(
    ApiExtraModels(ResponseTemplateDto),
    ApiResponse({
      status: options.httpStatus,
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseTemplateDto) },
          {
            properties: {
              status: {
                $ref: getSchemaPath(options.model),
              },
            },
          },
        ],
      },
    }),
  );
};
