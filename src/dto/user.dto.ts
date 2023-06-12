import { TSocialType } from "@/types/social";

export class LoginRequestParamDTO {
  code: string;

  type: TSocialType;

  constructor(type: TSocialType, code: string) {
    this.type = type;
    this.code = code;
  }
}
