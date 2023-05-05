import { TOAuthType } from "@/types/oauth";

export class LoginRequestParamDTO {
  code: string;

  type: TOAuthType;

  constructor(type: TOAuthType, code: string) {
    this.type = type;
    this.code = code;
  }
}
