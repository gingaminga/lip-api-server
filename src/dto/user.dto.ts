import { TSocialType } from "@/types/social";

export class ChangeNicknameRequestParamDTO {
  deviceToken?: string;

  nickname: string;

  constructor(nickname: string, token?: string) {
    this.deviceToken = token;
    this.nickname = nickname;
  }
}

export class DuplicateNicknameRequestParamDTO {
  nickname: string;

  constructor(nickname: string) {
    this.nickname = nickname;
  }
}

export class LoginRequestParamDTO {
  code: string;

  type: TSocialType;

  constructor(type: TSocialType, code: string) {
    this.type = type;
    this.code = code;
  }
}

export class LogoutRequestParamDTO {
  deviceToken?: string;

  constructor(token?: string) {
    this.deviceToken = token;
  }
}
