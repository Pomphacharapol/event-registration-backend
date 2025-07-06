import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseStatusDto, ResponseTemplateDto } from '../../dto';
import { PaginationMetaDto, PaginationResponseDto } from './dto';
import { ApiPaginatedTemplateResponseOptions } from './types';

// Tutorial create controller decorator for swagger api generic type
// https://pietrzakadrian.com/blog/how-to-create-pagination-in-nestjs-with-typeorm-swagger

const ApiPaginatedResponse = (options: ApiPaginatedTemplateResponseOptions) => {
  return applyDecorators(
    ApiExtraModels(PaginationResponseDto),
    ApiOkResponse({
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponseDto) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(options.model) },
              },
            },
          },
        ],
      },
    }),
  );
};

const ApiPaginatedTemplateResponse = (
  options: ApiPaginatedTemplateResponseOptions,
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
                allOf: [
                  {
                    properties: {
                      items: {
                        type: 'array',
                        items: { $ref: getSchemaPath(options.model) },
                      },
                      meta: {
                        $ref: getSchemaPath(PaginationMetaDto),
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  );
};

export { ApiPaginatedResponse, ApiPaginatedTemplateResponse };
