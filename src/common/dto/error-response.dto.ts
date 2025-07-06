import { ApiProperty } from '@nestjs/swagger';

export class ErrorNotFoundDto {
  @ApiProperty({ description: 'error code', example: 'E0404' })
  code: string;

  @ApiProperty({ description: 'error message', example: 'Not Found' })
  message: string;

  @ApiProperty({
    description:
      'meta display object validation or string message (only local environment)',
    required: false,
  })
  meta?: object | string | null;

  @ApiProperty({
    required: false,
    description: 'error stacktrace (only local environment)',
    example:
      'NotFoundErrorException: not found todo: o6he03WXl4c5OJ8\n    at TodoService.getById (/Users/MyName/Documents/MyProject/src/bitbucket.local/issue-nestjs-backend/src/todo/todo.service.ts:32:13)\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)',
  })
  stack?: string | null;
}

export class ErrorInternalServerDto {
  @ApiProperty({ description: 'error code', example: 'E0500' })
  code: string;

  @ApiProperty({
    description: 'error message',
    example: 'Internal Server Error',
  })
  message: string;

  @ApiProperty({
    description:
      'meta display object validation or string message (only local environment)',
    required: false,
  })
  meta?: object | string | null;

  @ApiProperty({
    required: false,
    description: 'error stacktrace (only local environment)',
  })
  stack?: string | null;
}

export class ErrorBadRequestDto {
  @ApiProperty({ description: 'error code', example: 'E0400' })
  code: string;

  @ApiProperty({ description: 'error message', example: 'Bad Request' })
  message: string;

  @ApiProperty({
    description:
      'meta display object validation or string message (only local environment)',
    example: {
      validationErrors: [
        {
          fieldName: 'creatorName',
          constraints: {
            isNotEmpty: 'creatorName should not be empty',
            isString: 'creatorName must be a string',
          },
        },
      ],
    },
  })
  meta?:
    | {
        validationErrors?: {
          fieldName: string;
          constraints: { [key: string]: string };
        }[];
      }
    | string
    | null;

  @ApiProperty({
    description: 'error stacktrace (only local environment)',
  })
  stack?: string | null;
}

export class ErrorUnauthorizeRequestDto {
  @ApiProperty({ description: 'error code', example: 'E0401' })
  code: string;

  @ApiProperty({ description: 'error message', example: 'Unauthorized' })
  message: string;
}

export class ErrorForbiddenRequestDto {
  @ApiProperty({ description: 'error code', example: 'E0403' })
  code: string;

  @ApiProperty({ description: 'error message', example: 'Forbidden' })
  message: string;
}

export class ErrorUnprocessableRequestDto {
  @ApiProperty({ description: 'error code', example: 'E0422' })
  code: string;

  @ApiProperty({ description: 'error message', example: 'Unprocessable' })
  message: string;
}

export class ErrorTooManyRequestsDto {
  @ApiProperty({ description: 'error code', example: 'E0429' })
  code: string;

  @ApiProperty({ description: 'error message', example: 'Too many requests' })
  message: string;
}

export class ErrorDuplicateUserRequestsDto {
  @ApiProperty({ description: 'error code', example: 'E0409' })
  code: string;

  @ApiProperty({ description: 'error message', example: 'User already exists' })
  message: string;
}
