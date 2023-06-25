import { TSocialType } from "@/types/social";
import { JwtPayload } from "jsonwebtoken";

export interface IAccessTokenPayload extends JwtPayload {
  nickname: string;
  type: TSocialType;
}

export interface IRefreshTokenPayload extends JwtPayload {
  nickname: string;
  type: TSocialType;
}

export interface IAccessToken {
  accessToken: string;
}

export interface IToken extends IAccessToken {
  refreshToken: string;
}
