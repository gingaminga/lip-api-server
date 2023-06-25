import { IResponseKakaoUnlink, IResponseKakaoUserData, ISocialApi } from "@/types/social";
import CError from "@/utils/error";
import HTTP_STATUS_CODE from "@/utils/http-status-code";
import { KAKAO_URL } from "@/utils/lib/url";
import logger from "@/utils/logger";
import { AxiosBase } from "axios-classification";

class KakaoApi extends AxiosBase implements ISocialApi {
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
    const { data } = await this.post<null, IResponseKakaoUserData>(KAKAO_URL.API.PATH.USER_DATA, null);
    const { id, kakao_account: kakaoAccount } = data;
    const { profile, email } = kakaoAccount || {};
    const { nickname = "" } = profile || {};

    const userInfo = {
      email,
      id,
      nickname,
    };

    return userInfo;
  }

  /**
   * @description 연결 끊기
   */
  async unlink() {
    const endpoint = KAKAO_URL.API.PATH.UNLINK;

    await this.post<null, IResponseKakaoUnlink>(endpoint, null, {
      "Content-Type": "application/x-www-form-urlencoded",
    });

    return true;
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
