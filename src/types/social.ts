import { IToken } from "@/types/token";
import { AxiosBase } from "axios-classification";

export type TSocialType = "kakao" | "naver" | "google";

export interface IResponseNaverToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  error: string;
  error_description: string;
}

export interface INaverUserData {
  age: string;
  birth: string;
  birthyear: string;
  email: string;
  gender: string;
  id: string;
  mobile: string;
  name: string;
  nickname: string;
  profile_image: string;
}

export interface IResponseNaverUserData {
  message: string;
  response: INaverUserData;
  resultcode: string;
}

export interface ISocialUserData {
  id: number | string;
  nickname: string;
}

export interface ISocialAuth extends AxiosBase {
  getSocialURL(): string;
  getToken(code: string): Promise<IToken>;
}

export interface ISocialApi extends AxiosBase {
  setAccessTokenInHeader(token: string): void;
  getUserInfo(): Promise<ISocialUserData>;
}
