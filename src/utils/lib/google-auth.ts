import { ISocialAuth } from "@/types/social";
import constants from "@/utils/constants";
import CError from "@/utils/error";
import HTTP_STATUS_CODE from "@/utils/http-status-code";
import { GOOGLE_URL } from "@/utils/lib/url";
import logger from "@/utils/logger";
import { AxiosBase } from "axios-classification";

class GoogleAuth extends AxiosBase implements ISocialAuth {
  private readonly key = constants.SOCIAL.GOOGLE.KEY;

  private readonly redirectUri = `${constants.SOCIAL.REDIRECT_URI}/callback/google`;

  /**
   * @description 소셜 URL 가져오기
   */
  getSocialURL() {
    const { HOST, PATH } = GOOGLE_URL.AUTH;
    const url = `${HOST}${PATH.AUTHORIZE}?client_id=${this.key}&redirect_uri=${this.redirectUri}&response_type=code&scope=openid%20profile%20email&access_type=offline&include_granted_scopes=true`;

    return url;
  }
}

export const GoogleAuthClient = new GoogleAuth({
  baseURL: GOOGLE_URL.AUTH.HOST,
});

GoogleAuthClient.setRequestInterceptor(
  (request) => {
    const { baseURL, data, url } = request;

    logger.info(`Request ${baseURL}${url}\n%o`, data);

    return request;
  },
  (error) => {
    throw error;
  },
);

GoogleAuthClient.setResponseInterceptor(
  (response) => {
    const { data, config } = response;
    const { baseURL, method = "", url } = config;

    logger.info(`[${method.toUpperCase()}] Response ${baseURL}${url}\n%o`, data);

    return response;
  },
  async (error) => {
    if (!GoogleAuthClient.isAxiosError(error)) {
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
