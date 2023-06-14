import { IResponseGoogleUserData, ISocialApi } from "@/types/social";
import CError from "@/utils/error";
import HTTP_STATUS_CODE from "@/utils/http-status-code";
import { GOOGLE_URL } from "@/utils/lib/url";
import logger from "@/utils/logger";
import { AxiosBase } from "axios-classification";

class GoogleApi extends AxiosBase implements ISocialApi {
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
    const { data } = await this.get<null, IResponseGoogleUserData>(GOOGLE_URL.API.PATH.USER_DATA, null);
    const { email, id, name } = data;

    const userInfo = {
      email,
      id,
      nickname: name,
    };

    return userInfo;
  }
}

export const GoogleApiClient = new GoogleApi({
  baseURL: GOOGLE_URL.API.HOST,
});

GoogleApiClient.setRequestInterceptor(
  (request) => {
    const { baseURL, data, url } = request;

    logger.info(`Request ${baseURL}${url}\n%o`, data);

    return request;
  },
  (error) => {
    throw error;
  },
);

GoogleApiClient.setResponseInterceptor(
  (response) => {
    const { data, config } = response;
    const { baseURL, method = "", url } = config;

    logger.info(`[${method.toUpperCase()}] Response ${baseURL}${url}\n%o`, data);

    return response;
  },
  async (error) => {
    if (!GoogleApiClient.isAxiosError(error)) {
      throw error;
    }

    const { response } = error;
    const { config, data, status, statusText } = response || {};
    const { baseURL, method, url } = config || {};

    logger.error(`[${method?.toUpperCase()}] Response ${baseURL}${url} ${statusText}(${status})\n%o`, data);

    const customError = new CError("Google Auth Error", HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);

    throw customError;
  },
);
