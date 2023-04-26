import { TOAuthType } from "@/types/oauth";

export class GetOAuthURLRequestParamDTO {
  type: TOAuthType;

  constructor(type: TOAuthType) {
    this.type = type;
  }
}

export class OAuthLoginRequestParamDTO {
  code: string;

  type: TOAuthType;

  constructor(type: TOAuthType, code: string) {
    this.type = type;
    this.code = code;
  }
}
