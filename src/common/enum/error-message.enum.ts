export enum UnauthorizedErrorMessageEnum {
  AUTHORIZATION_HEADER_MISSING = 'Authorization header missing',
  TOKEN_EXPIRED = 'Token expired',
  TOKEN_INVALID = 'Token invalid',
  TOKEN_INVALID_CREDENTIALS = 'Invalid credentials',
  TOKEN_VERIFICATION_FAILED = 'Token verification failed',
}

export enum JwtErrorMessageEnum {
  EXPIRED = 'jwt expired',
  INVALID_SIGNATURE = 'invalid signature',
}
