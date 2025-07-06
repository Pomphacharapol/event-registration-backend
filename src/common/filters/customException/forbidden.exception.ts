import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ForbiddenErrorException } from '../../dto/custom-error-type.dto';
import { ResponseTemplateDto } from '../../interceptors/template-response';
import { getResponseStatusFromHttpResponse } from '../../interceptors/template-response/util';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorForbidden = <ResponseTemplateDto<ForbiddenErrorException>>{
      status: getResponseStatusFromHttpResponse(HttpStatus.FORBIDDEN),
    };

    response.status(exception.getStatus()).json(errorForbidden);
  }
}
