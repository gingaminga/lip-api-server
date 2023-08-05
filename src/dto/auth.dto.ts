import { TSocialType } from "@/types/social";

export class ReissueTokenRequestParamDTO {
  refreshToken: string;

  constructor(token: string) {
    this.refreshToken = token;
  }
}

export class GetSocialURLRequestParamDTO {
  type: TSocialType;

  constructor(type: TSocialType) {
    this.type = type;
  }
}
