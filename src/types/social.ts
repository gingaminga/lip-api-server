import { IToken } from "@/types/token";
import { AxiosBase } from "axios-classification";

export type TSocialType = "kakao" | "naver" | "google";

// google
export interface IResponseGoogleToken {
  access_token: string;
  expires_in: number; // 액세스토큰 만료시간(초)
  refresh_token: string;
  scope?: string;
  token_type: string; // bearer 고정
}

export interface IResponseGoogleUserData {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

// kakao
export interface IResponseKakaoToken {
  access_token: string;
  expires_in: number; // 액세스토큰 만료시간(초)
  id_token?: string;
  refresh_token: string;
  refresh_token_expires_in: number; // 리프레시토큰 만료시간(초)
  scope?: string;
  token_type: string; // bearer 고정
}
export interface IKakaoPartnerUserData {
  uuid: string;
}

export interface IKakaoAccountProfileUserData {
  is_default_image?: boolean;
  nickname?: string;
  profile_image_url?: string;
  thumbnail_image_url?: string;
}

export interface IKakaoPropertyUserData {
  nickname: string;
}

export interface IKakaoAccountUserData {
  age_range_needs_agreement?: boolean;
  age_range?: string; // 연령대
  birthday?: string; // 생일 (MMDD)
  birthday_needs_agreement?: boolean;
  birthday_type?: string; // 생일 타입 (양력/음력)
  birthyear?: string; // 출생연도 (YYYY 형식)
  birthyear_needs_agreement?: boolean;
  ci?: string;
  ci_authenticated_at?: Date;
  ci_needs_agreement?: boolean;
  email?: string;
  email_needs_agreement?: boolean;
  gender?: string;
  gender_needs_agreement?: boolean;
  has_email?: boolean;
  is_email_valid?: boolean;
  is_email_verified?: boolean;
  name?: string; // 닉네임
  name_needs_agreement?: boolean;
  phone_number?: string;
  phone_number_needs_agreement?: boolean;
  profile?: IKakaoAccountProfileUserData;
  profile_image_needs_agreement?: boolean;
  profile_needs_agreement?: boolean;
  profile_nickname_needs_agreement?: boolean;
}

export interface IResponseKakaoUserData {
  connected_at?: Date;
  for_partner?: IKakaoPartnerUserData;
  has_signed_up?: boolean;
  id: number;
  kakao_account?: IKakaoAccountUserData;
  properties?: IKakaoPropertyUserData;
  synched_at?: Date;
}

// naver
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

export interface ISocailAuth2 {
  getToken(code: string): Promise<IToken>;
}

export interface ISocialAuth extends AxiosBase {
  getSocialURL(): string;
}

export interface ISocialApi extends AxiosBase {
  setAccessTokenInHeader(token: string): void;
  getUserInfo(): Promise<ISocialUserData>;
}
