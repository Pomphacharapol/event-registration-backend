import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorUnauthorizeRequestDto } from '../../dto';
import { ResponseTemplateDto } from '../../interceptors/template-response';
import { getResponseStatusFromHttpResponse } from '../../interceptors/template-response/util';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorUnauth = <ResponseTemplateDto<ErrorUnauthorizeRequestDto>>{
      status: getResponseStatusFromHttpResponse(HttpStatus.UNAUTHORIZED),
    };

    response.status(exception.getStatus()).json(errorUnauth);
  }
}
