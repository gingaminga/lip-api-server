import { TOAuthType } from "@/types/oauth";

export class ReissueTokenRequestParamDTO {
  refreshToken: string;

  constructor(token: string) {
    this.refreshToken = token;
  }
}

export class ReissueTokenDTO extends ReissueTokenRequestParamDTO {
  nickname: string;

  type: TOAuthType;

  constructor(token: string, nickname: string, type: TOAuthType) {
    super(token);

    this.nickname = nickname;
    this.type = type;
  }
}

export class GetOAuthURLRequestParamDTO {
  type: TOAuthType;

  constructor(type: TOAuthType) {
    this.type = type;
  }
}
