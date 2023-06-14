import { IResponseKakaoToken, ISocialAuth } from "@/types/social";
import constants from "@/utils/constants";
import CError from "@/utils/error";
import HTTP_STATUS_CODE from "@/utils/http-status-code";
import { KAKAO_URL } from "@/utils/lib/url";
import logger from "@/utils/logger";
import { AxiosBase } from "axios-classification";

interface IRequestGetToken {
  client_id: string;
  client_secret: string;
  code: string;
  grant_type: string;
  redirect_uri: string;
}

class KakaoAuth extends AxiosBase implements ISocialAuth {
  private readonly key = constants.SOCIAL.KAKAO.KEY;

  private readonly secretKey = constants.SOCIAL.KAKAO.SECRET_KEY;

  private readonly redirectUri = `${constants.SOCIAL.REDIRECT_URI}/callback/kakao`;

  /**
   * @description 소셜 URL 가져오기
   */
  getSocialURL() {
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
      client_secret: this.secretKey,
      code,
      grant_type: "authorization_code", // 고정 값
      redirect_uri: this.redirectUri,
    };

    const { data } = await this.post<IRequestGetToken, IResponseKakaoToken>(endpoint, params, {
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
