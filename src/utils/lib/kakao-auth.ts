import constants from "@/utils/constants";
import { KAKAO_URL } from "@/utils/lib/url";
import { AxiosBase } from "axios-classification";

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
}

export const KakaoAuthClient = new KakaoAuth({
  baseURL: KAKAO_URL.AUTH.HOST,
});
