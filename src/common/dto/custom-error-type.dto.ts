import { HttpException, HttpStatus } from '@nestjs/common';
import { getResponseStatusFromHttpResponse } from '../interceptors/template-response/util';

class CustomExceptionOptions {
  httpStatus?: HttpStatus;
  code?: string;
  message?: string;
  meta?: any;
  data?: any;
}

export class CustomHttpException extends HttpException {
  code: string;
  message: string;
  meta: any;
  data: any;
  httpStatusCode: HttpStatus;

  constructor(options: CustomExceptionOptions) {
    super(
      {
        code: options.code,
        message: options.message,
        meta: options.meta,
      },
      options.httpStatus,
    );

    this.httpStatusCode = options.httpStatus
      ? options.httpStatus
      : HttpStatus.INTERNAL_SERVER_ERROR;
    this.code = options.code ? options.code : 'UnknownError';
    this.message = options.message ? options.message : 'Unknown error';
    this.meta = options.meta;
    this.data = options.data || {};
  }
}

export class NotFoundErrorException extends CustomHttpException {
  constructor(options?: CustomExceptionOptions) {
    const defaultError = getResponseStatusFromHttpResponse(
      HttpStatus.NOT_FOUND,
    );
    const errRespCode = options?.code ? options.code : defaultError.code;
    const errRespMessage = options?.message
      ? options.message
      : defaultError.message;
    super({
      httpStatus: HttpStatus.NOT_FOUND,
      code: errRespCode,
      message: errRespMessage,
      meta: options?.meta,
      data: options?.data,
    });
  }
}

export class UnauthorizedErrorException extends CustomHttpException {
  constructor(options?: CustomExceptionOptions) {
    const defaultError = getResponseStatusFromHttpResponse(
      HttpStatus.UNAUTHORIZED,
    );
    const errRespCode = options?.code ? options.code : defaultError.code;
    const errRespMessage = options?.message
      ? options.message
      : defaultError.message;
    super({
      httpStatus: HttpStatus.UNAUTHORIZED,
      code: errRespCode,
      message: errRespMessage,
      meta: options?.meta,
      data: options?.data,
    });
  }
}

export class ForbiddenErrorException extends CustomHttpException {
  constructor(options?: CustomExceptionOptions) {
    const defaultError = getResponseStatusFromHttpResponse(
      HttpStatus.FORBIDDEN,
    );
    const errRespCode = options?.code ? options.code : defaultError.code;
    const errRespMessage = options?.message
      ? options.message
      : defaultError.message;
    super({
      httpStatus: HttpStatus.FORBIDDEN,
      code: errRespCode,
      message: errRespMessage,
      meta: options?.meta,
      data: options?.data,
    });
  }
}

export class UnprocessableErrorException extends CustomHttpException {
  constructor(options?: CustomExceptionOptions) {
    const defaultError = getResponseStatusFromHttpResponse(
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
    const errRespCode = options?.code ? options.code : defaultError.code;
    const errRespMessage = options?.message
      ? options.message
      : defaultError.message;
    super({
      httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
      code: errRespCode,
      message: errRespMessage,
      meta: options?.meta,
      data: options?.data,
    });
  }
}

export class TooManyRequestsErrorException extends CustomHttpException {
  constructor(options?: CustomExceptionOptions) {
    const defaultError = getResponseStatusFromHttpResponse(
      HttpStatus.TOO_MANY_REQUESTS,
    );
    const errRespCode = options?.code ? options.code : defaultError.code;
    const errRespMessage = options?.message
      ? options.message
      : defaultError.message;
    super({
      httpStatus: HttpStatus.TOO_MANY_REQUESTS,
      code: errRespCode,
      message: errRespMessage,
      meta: options?.meta,
      data: options?.data,
    });
  }
}

export class InternalErrorException extends CustomHttpException {
  constructor(options?: CustomExceptionOptions) {
    const defaultError = getResponseStatusFromHttpResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    const errRespCode = options?.code ? options.code : defaultError.code;
    const errRespMessage = options?.message
      ? options.message
      : defaultError.message;
    super({
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      code: errRespCode,
      message: errRespMessage,
      meta: options?.meta,
      data: options?.data,
    });
  }
}

export class BadRequestErrorException extends CustomHttpException {
  constructor(options?: CustomExceptionOptions) {
    const defaultError = getResponseStatusFromHttpResponse(
      HttpStatus.BAD_REQUEST,
    );
    const errRespCode = options?.code ? options.code : defaultError.code;
    const errRespMessage = options?.message
      ? options.message
      : defaultError.message;
    super({
      httpStatus: HttpStatus.BAD_REQUEST,
      code: errRespCode,
      message: errRespMessage,
      meta: options?.meta,
      data: options?.data,
    });
  }
}

export class DuplicateUserException extends CustomHttpException {
  constructor(options?: CustomExceptionOptions) {
    const defaultError = getResponseStatusFromHttpResponse(HttpStatus.CONFLICT);
    const errRespCode = options?.code ? options.code : defaultError.code;
    const errRespMessage = options?.message
      ? options.message
      : 'User already exists';
    super({
      httpStatus: HttpStatus.CONFLICT,
      code: errRespCode,
      message: errRespMessage,
      meta: options?.meta,
      data: options?.data,
    });
  }
}
