import { TOAuthType } from "@/types/oauth";

export class GetOAuthURLRequestParamDTO {
  type: TOAuthType;

  constructor(type: TOAuthType) {
    this.type = type;
  }
}
