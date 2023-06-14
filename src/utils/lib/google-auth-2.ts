import { IResponseGoogleToken, ISocailAuth2 } from "@/types/social";
import constants from "@/utils/constants";
import CError from "@/utils/error";
import HTTP_STATUS_CODE from "@/utils/http-status-code";
import { GOOGLE_URL } from "@/utils/lib/url";
import logger from "@/utils/logger";
import { AxiosBase } from "axios-classification";

interface IRequestGetToken {
  client_id: string;
  client_secret: string;
  code: string;
  grant_type: string;
  redirect_uri: string;
}

class GoogleAuth2 extends AxiosBase implements ISocailAuth2 {
  private readonly key = constants.SOCIAL.GOOGLE.KEY;

  private readonly secretKey = constants.SOCIAL.GOOGLE.SECRET_KEY;

  private readonly redirectUri = `${constants.SOCIAL.REDIRECT_URI}/callback/google`;

  /**
   * @description 토큰 발급하기
   * @param code 인가코드
   */
  async getToken(code: string) {
    const endpoint = GOOGLE_URL.AUTH2.PATH.TOKEN;
    const params = {
      client_id: this.key,
      client_secret: this.secretKey,
      code,
      grant_type: "authorization_code", // 고정 값
      redirect_uri: this.redirectUri,
    };

    const { data } = await this.post<IRequestGetToken, IResponseGoogleToken>(endpoint, params, {
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const tokenData = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };

    return tokenData;
  }
}

export const GoogleAuth2Client = new GoogleAuth2({
  baseURL: GOOGLE_URL.AUTH2.HOST,
});

GoogleAuth2Client.setRequestInterceptor(
  (request) => {
    const { baseURL, data, url } = request;

    logger.info(`Request ${baseURL}${url}\n%o`, data);

    return request;
  },
  (error) => {
    throw error;
  },
);

GoogleAuth2Client.setResponseInterceptor(
  (response) => {
    const { data, config } = response;
    const { baseURL, method = "", url } = config;

    logger.info(`[${method.toUpperCase()}] Response ${baseURL}${url}\n%o`, data);

    return response;
  },
  async (error) => {
    if (!GoogleAuth2Client.isAxiosError(error)) {
      throw error;
    }

    const { response } = error;
    const { config, data, status, statusText } = response || {};
    const { baseURL, method, url } = config || {};

    logger.error(`[${method?.toUpperCase()}] Response ${baseURL}${url} ${statusText}(${status})\n%o`, data);

    const customError = new CError("Google Auth2 Error", HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);

    throw customError;
  },
);
