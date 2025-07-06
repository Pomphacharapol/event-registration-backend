import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { forceJsonStringify } from '../../app-logger';
import { AppLoggerService } from '../../app-logger/app-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {
    this.logger.setContext('LogHttp');
  }

  #isExcludePath(method: string, url: string): boolean {
    return method === 'GET' && ['/health'].includes(url);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, headers } = context
      .switchToHttp()
      .getRequest<Request>();
    const requestAt = Date.now();

    if (!this.#isExcludePath(method, url)) {
      this.logger.info(
        `PAYLOAD Inbound ${forceJsonStringify({ ...headers, method, fullPath: url })} ${forceJsonStringify(body)}`,
      );
    }

    return next.handle().pipe(
      tap({
        next: (responseData: any) => {
          if (!this.#isExcludePath(method, url)) {
            const responseTime = Math.round(Date.now() - requestAt);

            this.logger.info(
              `PAYLOAD Outbound ${forceJsonStringify({
                ...response.getHeaders(),
                statusCode: response.statusCode,
                method,
                responseTime,
              })} ${forceJsonStringify(responseData)}`,
            );
          }
        },
        error: (responseData: any) => {
          if (this.#isExcludePath(method, url)) {
            return;
          }

          const responseTime = Math.round(Date.now() - requestAt);

          // WARN: when error bad request log will not match with response because response will transform again in badRequest.exception.ts
          this.logger.info(
            `PAYLOAD Outbound ${forceJsonStringify({
              ...response.getHeaders(),
              statusCode:
                responseData.status || HttpStatus.INTERNAL_SERVER_ERROR,
              method,
              responseTime,
            })} ${forceJsonStringify(responseData)}`,
          );
        },
      }),
    );
  }
}
