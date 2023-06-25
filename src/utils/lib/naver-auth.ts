import {
  IResponseNaverRenewToken,
  IResponseNaverToken,
  IResponseNaverUnlink,
  ISocailAuth2,
  ISocialAuth,
} from "@/types/social";
import constants from "@/utils/constants";
import CError from "@/utils/error";
import HTTP_STATUS_CODE from "@/utils/http-status-code";
import { NAVER_URL } from "@/utils/lib/url";
import logger from "@/utils/logger";
import { AxiosBase } from "axios-classification";

interface IRequestUnlink {
  client_id: string;
  client_secret: string;
  access_token: string;
  grant_type: string;
}

interface IRequestGetRenewToken {
  client_id: string;
  client_secret: string;
  grant_type: string;
  refresh_token: string;
}

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
   * @description 소셜 액세스 토큰 재발급하기
   * @param token refresh token
   * @returns 토큰 정보
   */
  async getRenewToken(token: string) {
    const endpoint = NAVER_URL.AUTH.PATH.TOKEN;
    const params = {
      client_id: this.key,
      client_secret: this.secretKey,
      grant_type: "refresh_token",
      refresh_token: token,
    };

    const { data } = await this.post<IRequestGetRenewToken, IResponseNaverRenewToken>(endpoint, params, {
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const tokenData = {
      accessToken: data.access_token,
    };

    return tokenData;
  }

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

  /**
   * @description 연결 끊기
   * @param token 액세스 토큰
   */
  async unlink(token: string) {
    const endpoint = NAVER_URL.AUTH.PATH.UNLINK;
    const params = {
      access_token: token,
      client_id: this.key,
      client_secret: this.secretKey,
      grant_type: "delete", // 고정 값
      service_provider: "NAVER",
    };

    await this.post<IRequestUnlink, IResponseNaverUnlink>(endpoint, params, {
      "Content-Type": "application/x-www-form-urlencoded",
    });

    return true;
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
