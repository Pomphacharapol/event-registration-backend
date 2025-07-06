import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseStatusDto, ResponseTemplateDto } from '../../dto';
import { ApiTemplateResponseOptions } from './types';

// Tutorial create controller decorator for swagger api generic type
// https://pietrzakadrian.com/blog/how-to-create-pagination-in-nestjs-with-typeorm-swagger

export const ApiNoContentResponse = (options: ApiTemplateResponseOptions) => {
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
              data: {},
            },
          },
        ],
      },
    }),
  );
};
