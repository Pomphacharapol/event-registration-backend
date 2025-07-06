import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ValidationError,
} from '@nestjs/common';
import { Response } from 'express';
import { AppLoggerService, forceJsonStringify } from '../../app-logger';
import { ErrorBadRequestDto } from '../../dto';
import { ResponseTemplateDto } from '../../interceptors/template-response';
import { getResponseStatusFromHttpResponse } from '../../interceptors/template-response/util';

type validationErrorException = {
  message: [ValidationError];
};

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly responseErrorMeta: boolean,
  ) {
    this.logger.setContext('BadRequestExceptionFilter');
  }

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { body } = ctx.getRequest<Request>();

    const errorResponse = <ResponseTemplateDto<ErrorBadRequestDto>>{
      status: getResponseStatusFromHttpResponse(exception.getStatus()),
    };

    const vErrors = exception.getResponse() as validationErrorException;
    if (vErrors && Array.isArray(vErrors.message) && this.responseErrorMeta) {
      const validationErrors = vErrors.message.map(
        (validationErr: ValidationError) => {
          if (!validationErr.property && !validationErr.constraints) {
            return {
              message: validationErr,
            };
          }

          return {
            fieldName: validationErr.property,
            constraints: validationErr.constraints,
          };
        },
      );

      errorResponse.status.meta = { validationErrors };
    }

    if (vErrors && typeof vErrors.message === 'string') {
      errorResponse.status.message = vErrors.message;
    }

    this.logger.error({
      stack: forceJsonStringify(errorResponse),
      variable: body,
    });

    if (!this.responseErrorMeta) {
      delete errorResponse.status.meta;
    }

    response.status(exception.getStatus()).json(errorResponse);
  }
}
