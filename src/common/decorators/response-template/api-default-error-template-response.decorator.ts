import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ErrorBadRequestDto,
  ErrorDuplicateUserRequestsDto,
  ErrorForbiddenRequestDto,
  ErrorInternalServerDto,
  ErrorNotFoundDto,
  ErrorTooManyRequestsDto,
  ErrorUnauthorizeRequestDto,
  ErrorUnprocessableRequestDto,
} from '../../dto';
import { ApiErrorTemplateResponse } from './api-error-template-response.decorator';

// Tutorial create controller decorator for swagger api generic type
// https://pietrzakadrian.com/blog/how-to-create-pagination-in-nestjs-with-typeorm-swagger

class ApiDefaultErrorsTemplateResponseOptions {
  disableNotFound?: boolean = false;
  disableInternalServerError?: boolean = false;
  disableBadRequest?: boolean = false;
  disableForbidden?: boolean = false;
  disableTooManyRequests?: boolean = false;
  disableUnauthorized?: boolean = false;
  disableUnprocessable?: boolean = false;
  disableDuplicateUser?: boolean = false;
}

export const ApiDefaultErrorsTemplateResponse = (
  options?: ApiDefaultErrorsTemplateResponseOptions,
) => {
  if (!options) {
    return applyDecorators(
      ApiErrorTemplateResponse({
        httpStatus: HttpStatus.NOT_FOUND,
        model: ErrorNotFoundDto,
      }),
      ApiErrorTemplateResponse({
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        model: ErrorInternalServerDto,
      }),
      ApiErrorTemplateResponse({
        httpStatus: HttpStatus.BAD_REQUEST,
        model: ErrorBadRequestDto,
      }),
      ApiErrorTemplateResponse({
        httpStatus: HttpStatus.UNAUTHORIZED,
        model: ErrorUnauthorizeRequestDto,
      }),
      ApiErrorTemplateResponse({
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        model: ErrorUnprocessableRequestDto,
      }),
      ApiErrorTemplateResponse({
        httpStatus: HttpStatus.FORBIDDEN,
        model: ErrorForbiddenRequestDto,
      }),
      ApiErrorTemplateResponse({
        httpStatus: HttpStatus.TOO_MANY_REQUESTS,
        model: ErrorTooManyRequestsDto,
      }),
      ApiErrorTemplateResponse({
        httpStatus: HttpStatus.CONFLICT,
        model: ErrorDuplicateUserRequestsDto,
      }),
    );
  }

  const listDecorators: (
    | ClassDecorator
    | MethodDecorator
    | PropertyDecorator
  )[] = [];

  if (!options.disableNotFound) {
    listDecorators.push(
      ApiErrorTemplateResponse({
        httpStatus: HttpStatus.NOT_FOUND,
        model: ErrorNotFoundDto,
      }),
    );
  }

  if (!options.disableInternalServerError) {
    listDecorators.push(
      ApiErrorTemplateResponse({
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        model: ErrorInternalServerDto,
      }),
    );
  }

  if (!options.disableBadRequest) {
    listDecorators.push(
      ApiErrorTemplateResponse({
        httpStatus: HttpStatus.BAD_REQUEST,
        model: ErrorBadRequestDto,
      }),
    );
  }

  if (!options.disableForbidden) {
    listDecorators.push(
      ApiErrorTemplateResponse({
        httpStatus: HttpStatus.FORBIDDEN,
        model: ErrorForbiddenRequestDto,
      }),
    );
  }

  if (!options.disableTooManyRequests) {
    listDecorators.push(
      ApiErrorTemplateResponse({
        httpStatus: HttpStatus.TOO_MANY_REQUESTS,
        model: ErrorTooManyRequestsDto,
      }),
    );
  }

  if (!options.disableUnprocessable) {
    listDecorators.push(
      ApiErrorTemplateResponse({
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        model: ErrorUnprocessableRequestDto,
      }),
    );
  }

  if (!options.disableUnauthorized) {
    listDecorators.push(
      ApiErrorTemplateResponse({
        httpStatus: HttpStatus.UNAUTHORIZED,
        model: ErrorUnauthorizeRequestDto,
      }),
    );
  }

  if (!options.disableDuplicateUser) {
    listDecorators.push(
      ApiErrorTemplateResponse({
        httpStatus: HttpStatus.CONFLICT,
        model: ErrorDuplicateUserRequestsDto,
      }),
    );
  }

  return applyDecorators(...listDecorators);
};
