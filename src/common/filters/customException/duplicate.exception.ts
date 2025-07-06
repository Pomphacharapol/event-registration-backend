import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DatabaseError } from 'pg-protocol';
import { QueryFailedError } from 'typeorm';
import { AppLoggerService } from '../../app-logger';
import { ResponseTemplateDto } from '../../interceptors/template-response';
import { getResponseStatusFromHttpResponse } from '../../interceptors/template-response/util';

@Catch(QueryFailedError)
export class DuplicateExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly responseErrorMeta: boolean,
    private readonly responseErrorStacktrace: boolean,
  ) {
    this.logger.setContext('DuplicateExceptionFilter');
  }

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const err = exception.driverError as DatabaseError;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const internalServerError = getResponseStatusFromHttpResponse(httpStatus);
    const { body } = ctx.getRequest<Request>();
    let errorResponse: ResponseTemplateDto<any>;

    if (err.code === '23505') {
      httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
      const duplicateKeyError = getResponseStatusFromHttpResponse(httpStatus);
      errorResponse = <ResponseTemplateDto<any>>{
        status: {
          code: duplicateKeyError.code,
          message: 'Duplicate Key',
          stack: exception.stack,
          meta: exception,
        },
      };
    } else {
      errorResponse = <ResponseTemplateDto<any>>{
        status: {
          code: internalServerError.code,
          message: internalServerError.message,
          stack: exception.stack,
          meta: exception,
        },
      };
    }

    this.logger.error({ stack: errorResponse.status.stack, variable: body });

    if (!this.responseErrorMeta) {
      delete errorResponse.status.meta;
    }

    if (!this.responseErrorStacktrace) {
      delete errorResponse.status.stack;
    }

    response.status(httpStatus).json(errorResponse);
  }
}
