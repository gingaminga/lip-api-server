import { TSocialType } from "@/types/social";

export class ReissueTokenRequestParamDTO {
  refreshToken: string;

  constructor(token: string) {
    this.refreshToken = token;
  }
}

export class ReissueTokenDTO extends ReissueTokenRequestParamDTO {
  nickname: string;

  type: TSocialType;

  constructor(token: string, nickname: string, type: TSocialType) {
    super(token);

    this.nickname = nickname;
    this.type = type;
  }
}

export class GetSocialURLRequestParamDTO {
  type: TSocialType;

  constructor(type: TSocialType) {
    this.type = type;
  }
}
