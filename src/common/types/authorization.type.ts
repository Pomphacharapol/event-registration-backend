import { GrantTypeEnum } from '../enum';

export type AuthorizationUrlType = {
  client_id: string;
  scope: string;
  redirect_uri: string;
  response_type: string;
  audience: string;
};

export type GetAccessTokenByAuthorizationCode = {
  client_id: string;
  client_secret: string;
  code: string;
  grant_type: GrantTypeEnum;
  redirect_uri: string;
};
