import constants from "@/utils/constants";
import CError from "@/utils/error";
import HTTP_STATUS_CODE from "@/utils/http-status-code";
import { KAKAO_URL } from "@/utils/lib/url";
import logger from "@/utils/logger";
import { AxiosBase } from "axios-classification";

interface IRequestGetToken {
  client_id: string;
  code: string;
  grant_type: string;
  redirect_uri: string;
}

interface ITokenData {
  access_token: string;
  expires_in: number; // 액세스토큰 만료시간(초)
  id_token?: string;
  refresh_token: string;
  refresh_token_expires_in: number; // 리프레시토큰 만료시간(초)
  scope?: string;
  token_type: string; // bearer 고정
}

class KakaoAuth extends AxiosBase {
  private readonly key = constants.OAUTH.KAKAO.KEY;

  private readonly redirectUri = `${constants.OAUTH.REDIRECT_URI}/callback/kakao`;

  /**
   * @description OAuth URL 가져오기
   */
  getOAuthURL() {
    const { HOST, PATH } = KAKAO_URL.AUTH;
    const url = `${HOST}${PATH.AUTHORIZE}?client_id=${this.key}&redirect_uri=${this.redirectUri}&response_type=code`;

    return url;
  }

  /**
   * @description 토큰 발급하기
   * @param code 인가코드
   */
  async getToken(code: string) {
    const endpoint = KAKAO_URL.AUTH.PATH.TOKEN;
    const params = {
      client_id: this.key,
      code,
      grant_type: "authorization_code", // 고정 값
      redirect_uri: this.redirectUri,
    };

    const { data } = await this.post<IRequestGetToken, ITokenData>(endpoint, params, {
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const tokenData = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };

    return tokenData;
  }
}

export const KakaoAuthClient = new KakaoAuth({
  baseURL: KAKAO_URL.AUTH.HOST,
});

KakaoAuthClient.setRequestInterceptor(
  (request) => {
    const { baseURL, data, url } = request;

    logger.info(`Request ${baseURL}${url}\n%o`, data);

    return request;
  },
  (error) => {
    throw error;
  },
);

KakaoAuthClient.setResponseInterceptor(
  (response) => {
    const { data, config } = response;
    const { baseURL, method = "", url } = config;

    logger.info(`[${method.toUpperCase()}] Response ${baseURL}${url}\n%o`, data);

    return response;
  },
  async (error) => {
    if (!KakaoAuthClient.isAxiosError(error)) {
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
