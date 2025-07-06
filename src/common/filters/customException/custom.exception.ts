import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { AppLoggerService } from '../../app-logger/app-logger.service';
import { CustomHttpException } from '../../dto/custom-error-type.dto';
import { ResponseTemplateDto } from '../../interceptors/template-response';

@Catch(CustomHttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly responseErrorMeta: boolean,
    private readonly responseErrorStacktrace: boolean,
  ) {
    this.logger.setContext('HttpExceptionFilter');
  }

  catch(exception: CustomHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { body } = ctx.getRequest<Request>();

    const errorResponse = <ResponseTemplateDto<any>>{
      status: {
        code: exception.code,
        message: exception.message,
        stack: exception.stack,
        meta: exception.meta,
      },
      data: exception.data,
    };

    if (exception.httpStatusCode != 404 && exception.httpStatusCode != 401) {
      this.logger.error({ stack: errorResponse.status.stack, variable: body });
    }

    if (!this.responseErrorMeta) {
      delete errorResponse.status.meta;
    }

    if (!this.responseErrorStacktrace) {
      delete errorResponse.status.stack;
    }

    response.status(exception.getStatus()).json(errorResponse);
  }
}
