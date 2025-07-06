import { HttpStatus } from '@nestjs/common';
import { ResponseStatusDto } from '../../dto/template-response.dto';

const responseStatusDict: { [key: number]: ResponseStatusDto } = {
  200: <ResponseStatusDto>{
    code: 'S0200',
    message: 'Success',
  },
  201: <ResponseStatusDto>{
    code: 'S0201',
    message: 'Created',
  },
  202: <ResponseStatusDto>{
    code: 'S0202',
    message: 'Accepted',
  },
  400: <ResponseStatusDto>{
    code: 'E0400',
    message: 'Bad Request',
  },
  401: <ResponseStatusDto>{
    code: 'E0401',
    message: 'Unauthorized',
  },
  422: <ResponseStatusDto>{
    code: 'E0422',
    message: 'Unprocessable',
  },
  403: <ResponseStatusDto>{
    code: 'E0403',
    message: 'Forbidden',
  },
  404: <ResponseStatusDto>{
    code: 'E0404',
    message: 'Not Found',
  },
  429: <ResponseStatusDto>{
    code: 'E0429',
    message: 'Too Many Requests',
  },
  500: <ResponseStatusDto>{
    code: 'E0500',
    message: 'Internal Server Error',
  },
  503: <ResponseStatusDto>{
    code: 'E0503',
    message: 'Service Unavailable',
  },
  504: <ResponseStatusDto>{
    code: 'E0504',
    message: 'Gateway Timeout',
  },
};

export function getResponseStatusFromHttpResponse(
  httpResponseCode: HttpStatus,
): ResponseStatusDto {
  if (responseStatusDict[httpResponseCode]) {
    return responseStatusDict[httpResponseCode];
  }

  return responseStatusDict[HttpStatus.INTERNAL_SERVER_ERROR];
}
