import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppLoggerService } from '../../app-logger';
import { ResponseTemplateDto } from '../../dto';
import { getResponseStatusFromHttpResponse } from '../../interceptors/template-response/util';

@Catch()
export class UnknownExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly responseErrorStacktrace: boolean,
  ) {
    this.logger.setContext('UnknownExceptionFilter');
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { body } = ctx.getRequest<Request>();

    const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const internalServerError = getResponseStatusFromHttpResponse(httpStatus);

    const errorResponse = <ResponseTemplateDto<any>>{
      status: {
        code: internalServerError.code,
        message: internalServerError.message,
        stack: exception.stack,
      },
    };

    this.logger.error({ stack: errorResponse.status.stack, variable: body });

    if (!this.responseErrorStacktrace) {
      delete errorResponse.status.stack;
    }

    response.status(httpStatus).json(errorResponse);
  }
}
