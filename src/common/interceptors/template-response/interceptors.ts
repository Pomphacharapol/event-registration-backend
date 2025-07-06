import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';
import { ResponseTemplateDto } from '../../dto/template-response.dto';
import { IGNORE_TRANSFORM_TEMPLATE_RESPONSE } from './ignore-transform.decorator';
import { getResponseStatusFromHttpResponse } from './util';

@Injectable()
export class TemplateResponseTransformerInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  #shouldSkipTransformResponseTemplate(
    url: string,
    method: string,
    payload: any,
  ): boolean {
    // TODO: maybe we should load from config service
    const excludePaths = ['/health'];

    if (method === 'GET' && excludePaths.includes(url)) {
      return true;
    }

    if (payload?.status?.code && payload?.status?.message) {
      return true;
    }

    return false;
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseTemplateDto<any>> {
    const { statusCode } = context.switchToHttp().getResponse<Response>();
    const { method, url } = context.switchToHttp().getRequest<Request>();
    const ignoreTransformTemplateResponse =
      this.reflector.get<boolean>(
        IGNORE_TRANSFORM_TEMPLATE_RESPONSE,
        context.getHandler(),
      ) || false;

    return next.handle().pipe(
      map((data: any) => {
        if (
          ignoreTransformTemplateResponse ||
          this.#shouldSkipTransformResponseTemplate(url, method, data)
        ) {
          return data;
        }

        const formattedResponse = <ResponseTemplateDto<any>>{
          status: getResponseStatusFromHttpResponse(statusCode),
          data: data || {},
        };

        return formattedResponse;
      }),
    );
  }
}
