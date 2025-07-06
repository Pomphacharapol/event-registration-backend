import { HttpStatus, Injectable, LoggerService, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as os from 'os';
import { AppConfig } from '../config/app.config';
import { asyncLocalStorage } from '../context';
import { ErrorDetail, LogEventStatus, LogEventType, LogType } from './types';
import { forceJsonStringify } from './utils';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class AppLoggerService implements LoggerService {
  #context? = 'Logger';
  readonly #appName: string = 'nest';
  readonly #serviceName: string = 'boilerplate';

  constructor(configService: ConfigService) {
    const appConfig = configService.get<AppConfig>('app-config');

    this.#appName = appConfig.appName;
    this.#serviceName = appConfig.serviceName;
  }

  setContext(context: string) {
    this.#context = context;
  }

  #currentDateTime(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localeDateTime = this.#convertToLocalTimezone(now);
    const offsetHours =
      (offset < 0 ? '+' : '-') +
      (Math.abs(offset) / 60).toString().padStart(2, '0');
    const offsetMinutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
    const offsetStr = `${offsetHours}:${offsetMinutes}`;

    return localeDateTime.toISOString().slice(0, 19) + offsetStr;
  }

  #convertToLocalTimezone(inputDate: Date): Date {
    const offset = inputDate.getTimezoneOffset();

    return new Date(inputDate.setMinutes(inputDate.getMinutes() - offset));
  }

  #getContextFromStore() {
    const store = asyncLocalStorage.getStore();
    if (!store) {
      return {};
    }

    return {
      reqId: store.get('reqId'),
      sessionId: store.get('userId'),
      uri: store.get('uri'),
    };
  }

  #prefix(logType: LogType, message: any) {
    const { reqId = '-', sessionId = '-' } = this.#getContextFromStore();

    return `${this.#currentDateTime()} ${this.#appName} ${this.#serviceName} ${os.hostname()} ${logType} ${
      this.#context
    } ${sessionId} ${reqId} - ${message}`;
  }

  #formatError(errorDetail: ErrorDetail): string {
    const { uri = '-' } = this.#getContextFromStore();

    return `ERROR ${uri} ${errorDetail.stack || errorDetail.message} ${forceJsonStringify(errorDetail.inputParameter)} ${forceJsonStringify(
      errorDetail.variable,
    )}`;
  }

  log(message: any, ...optionalParams: any[]) {
    console.info(this.#prefix(LogType.INFO, message), ...optionalParams);
  }

  info(message: any, ...optionalParams: any[]) {
    console.info(this.#prefix(LogType.INFO, message), ...optionalParams);
  }

  logBusinessException(
    params: any,
    httpStatus: HttpStatus,
    responseTime: number,
    errorCode = 0,
    errorName = '',
    errorDescription = '',
  ) {
    const { uri = '-' } = this.#getContextFromStore();

    const operation = {
      event_type: LogEventType.BUSINESS_ERROR,
      status: LogEventStatus.FAIL,
      parameters: { ...params },
      http_code: httpStatus,
      error_code: errorCode,
      error_name: errorName,
      error_description: errorDescription,
      response_time: responseTime,
      uri: uri,
    };

    console.info(
      this.#prefix(LogType.WARN, `EVENT ${forceJsonStringify(operation)}`),
    );
  }

  logOperationEvent(
    eventStatus: LogEventStatus,
    httpStatus: HttpStatus,
    responseTime = 0,
    params = {},
  ) {
    this.#logMonitoring(
      LogEventType.OPERATION,
      eventStatus,
      httpStatus,
      params,
      responseTime,
    );
  }

  logBusinessEvent(httpStatus: HttpStatus, responseTime = 0, params = {}) {
    this.#logMonitoring(
      LogEventType.BUSINESS,
      LogEventStatus.SUCCESS,
      httpStatus,
      params,
      responseTime,
    );
  }

  #logMonitoring(
    eventType: LogEventType,
    eventStatus: LogEventStatus,
    httpStatus: HttpStatus,
    params = {},
    responseTime = 0,
  ) {
    const { uri = '-' } = this.#getContextFromStore();

    const operation = {
      event_type: eventType,
      status: eventStatus,
      parameters: { ...params },
      http_code: httpStatus,
      response_time: responseTime,
      uri: uri,
    };

    console.info(
      this.#prefix(LogType.INFO, `EVENT ${forceJsonStringify(operation)}`),
    );
  }

  error(err: ErrorDetail, ...optionalParams: any[]) {
    console.error(
      this.#prefix(LogType.ERROR, this.#formatError(err)),
      ...optionalParams,
    );
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    console.debug(message, ...optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    console.trace(message, ...optionalParams);
  }
}
