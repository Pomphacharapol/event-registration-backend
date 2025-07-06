import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { NotFoundErrorException } from '../../dto/custom-error-type.dto';
import { ResponseTemplateDto } from '../../interceptors/template-response';
import { getResponseStatusFromHttpResponse } from '../../interceptors/template-response/util';

@Catch(NotFoundException)
export class PathNotFoundExceptionFilter implements ExceptionFilter {
  constructor(private readonly responseErrorMeta: boolean) {}

  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorNotFoundPath = <ResponseTemplateDto<NotFoundErrorException>>{
      status: getResponseStatusFromHttpResponse(HttpStatus.NOT_FOUND),
    };

    errorNotFoundPath.status.meta = { path: request.url };

    if (!this.responseErrorMeta) {
      delete errorNotFoundPath.status.meta;
    }

    response.status(exception.getStatus()).json(errorNotFoundPath);
  }
}
