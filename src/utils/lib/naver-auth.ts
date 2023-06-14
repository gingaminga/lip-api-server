import { IResponseNaverToken, ISocailAuth2, ISocialAuth } from "@/types/social";
import constants from "@/utils/constants";
import CError from "@/utils/error";
import HTTP_STATUS_CODE from "@/utils/http-status-code";
import { NAVER_URL } from "@/utils/lib/url";
import logger from "@/utils/logger";
import { AxiosBase } from "axios-classification";

interface IRequestGetToken {
  client_id: string;
  client_secret: string;
  code: string;
  grant_type: string;
  state: string;
}

class NaverAuth extends AxiosBase implements ISocialAuth, ISocailAuth2 {
  private readonly key = constants.SOCIAL.NAVER.KEY;

  private readonly secretKey = constants.SOCIAL.NAVER.SECRET_KEY;

  private readonly redirectUri = `${constants.SOCIAL.REDIRECT_URI}/callback/naver`;

  private readonly state = encodeURI(constants.PROJECT_NAME);

  /**
   * @description 소셜 URL 가져오기
   */
  getSocialURL() {
    const { HOST, PATH } = NAVER_URL.AUTH;
    const url = `${HOST}${PATH.AUTHORIZE}?client_id=${this.key}&redirect_uri=${this.redirectUri}&response_type=code&state=${this.state}`;

    return url;
  }

  /**
   * @description 토큰 발급하기
   * @param code 인가코드
   */
  async getToken(code: string) {
    const endpoint = NAVER_URL.AUTH.PATH.TOKEN;
    const params = {
      client_id: this.key,
      client_secret: this.secretKey,
      code,
      grant_type: "authorization_code", // 고정 값
      state: this.state,
    };

    const { data } = await this.post<IRequestGetToken, IResponseNaverToken>(endpoint, params, {
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const tokenData = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };

    return tokenData;
  }
}

export const NaverAuthClient = new NaverAuth({
  baseURL: NAVER_URL.AUTH.HOST,
});

NaverAuthClient.setRequestInterceptor(
  (request) => {
    const { baseURL, data, url } = request;

    logger.info(`Request ${baseURL}${url}\n%o`, data);

    return request;
  },
  (error) => {
    throw error;
  },
);

NaverAuthClient.setResponseInterceptor(
  (response) => {
    const { data, config } = response;
    const { baseURL, method = "", url } = config;

    logger.info(`[${method.toUpperCase()}] Response ${baseURL}${url}\n%o`, data);

    return response;
  },
  async (error) => {
    if (!NaverAuthClient.isAxiosError(error)) {
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
