export type ErrorDetail = {
  stack?: string;
  message?: string;
  inputParameter?: any;
  variable?: any;
};

export enum LogType {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
  TRACE = 'TRACE',
}

export enum LogEventType {
  OPERATION = 'OPERATION',
  BUSINESS_ERROR = 'BIZ-ERROR',
  BUSINESS = 'BUSINESS',
}

export enum LogEventStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}
