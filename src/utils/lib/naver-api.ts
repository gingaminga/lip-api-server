import { IResponseNaverUserData, ISocialApi } from "@/types/social";
import CError from "@/utils/error";
import HTTP_STATUS_CODE from "@/utils/http-status-code";
import { NAVER_URL } from "@/utils/lib/url";
import logger from "@/utils/logger";
import { AxiosBase } from "axios-classification";

class NaverApi extends AxiosBase implements ISocialApi {
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
    const { data } = await this.post<null, IResponseNaverUserData>(NAVER_URL.API.PATH.USER_DATA, null);
    const { response } = data;
    const { email, id, nickname } = response;

    const userInfo = {
      email,
      id,
      nickname,
    };

    return userInfo;
  }
}

export const NaverApiClient = new NaverApi({
  baseURL: NAVER_URL.API.HOST,
});

NaverApiClient.setRequestInterceptor(
  (request) => {
    const { baseURL, data, url } = request;

    logger.info(`Request ${baseURL}${url}\n%o`, data);

    return request;
  },
  (error) => {
    throw error;
  },
);

NaverApiClient.setResponseInterceptor(
  (response) => {
    const { data, config } = response;
    const { baseURL, method = "", url } = config;

    logger.info(`[${method.toUpperCase()}] Response ${baseURL}${url}\n%o`, data);

    return response;
  },
  async (error) => {
    if (!NaverApiClient.isAxiosError(error)) {
      throw error;
    }

    const { response } = error;
    const { config, data, status, statusText } = response || {};
    const { baseURL, method, url } = config || {};

    logger.error(`[${method?.toUpperCase()}] Response ${baseURL}${url} ${statusText}(${status})\n%o`, data);

    const customError = new CError("Naver Auth Error", HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);

    throw customError;
  },
);
