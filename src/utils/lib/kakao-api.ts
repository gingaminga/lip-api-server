import CError from "@/utils/error";
import HTTP_STATUS_CODE from "@/utils/http-status-code";
import { KAKAO_URL } from "@/utils/lib/url";
import logger from "@/utils/logger";
import { AxiosBase } from "axios-classification";

interface IUserDataPartner {
  uuid: string;
}

interface IUserDataAccountProfile {
  is_default_image?: boolean;
  nickname?: string;
  profile_image_url?: string;
  thumbnail_image_url?: string;
}

interface IUserDataProperties {
  nickname: string;
}

interface IUserDataAccount {
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
  profile?: IUserDataAccountProfile;
  profile_image_needs_agreement?: boolean;
  profile_needs_agreement?: boolean;
  profile_nickname_needs_agreement?: boolean;
}

interface IUserData {
  connected_at?: Date;
  for_partner?: IUserDataPartner;
  has_signed_up?: boolean;
  id: number;
  kakao_account?: IUserDataAccount;
  properties?: IUserDataProperties;
  synched_at?: Date;
}

class KakaoApi extends AxiosBase {
  /**
   * @description 헤더에 액세스토큰 설정하기
   * @param token 액세스토큰
   */
  setAccessTokenInHeader(token: string) {
    this.setBearerToken(token);
  }

  /**
   * @description 유저 정보 가져오기
   * @param token 액세스토큰
   */
  async getUserInfo() {
    const { data } = await this.post<null, IUserData>(KAKAO_URL.API.PATH.USER_DATA, null);
    const { id, kakao_account: kakaoAccount } = data;
    const { profile } = kakaoAccount || {};
    const { nickname = "" } = profile || {};

    const userInfo = {
      id,
      nickname,
    };

    return userInfo;
  }
}

export const KakaoApiClient = new KakaoApi({
  baseURL: KAKAO_URL.API.HOST,
});

KakaoApiClient.setRequestInterceptor(
  (request) => {
    const { baseURL, data, url } = request;

    logger.info(`Request ${baseURL}${url}\n%o`, data);

    return request;
  },
  (error) => {
    throw error;
  },
);

KakaoApiClient.setResponseInterceptor(
  (response) => {
    const { data, config } = response;
    const { baseURL, method = "", url } = config;

    logger.info(`[${method.toUpperCase()}] Response ${baseURL}${url}\n%o`, data);

    return response;
  },
  async (error) => {
    if (!KakaoApiClient.isAxiosError(error)) {
      throw error;
    }

    const { response } = error;
    const { config, data, status, statusText } = response || {};
    const { baseURL, method, url } = config || {};

    logger.error(`[${method?.toUpperCase()}] Response ${baseURL}${url} ${statusText}(${status})\n%o`, data);

    const customError = new CError("Kakao Auth Error", HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);

    throw customError;
  },
);
