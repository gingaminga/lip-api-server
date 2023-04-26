import { TOAuthType } from "@/types/oauth";
import constants from "@/utils/constants";
import { KakaoApiClient } from "@/utils/lib/kakao-api";
import { KakaoAuthClient } from "@/utils/lib/kakao-auth";
import { Service } from "typedi";

@Service()
export default class OAuthService {
  private kakaoAuthClient = KakaoAuthClient;

  private kakaoApiClient = KakaoApiClient;

  /**
   * @description url 가져오기
   * @param type oauth 주체
   * @returns url 주소
   */
  getURL(type: TOAuthType) {
    let url = "";
    if (type === constants.OAUTH.KAKAO.NAME) {
      url = this.kakaoAuthClient.getOAuthURL();
    }

    return url;
  }

  /**
   * @description token 설정하기
   * @param type oauth 주체
   * @param code 인가코드
   */
  async setToken(type: TOAuthType, code: string) {
    if (type === constants.OAUTH.KAKAO.NAME) {
      const { access_token: accessToken } = await this.kakaoAuthClient.getToken(code);

      this.kakaoApiClient.setAccessTokenInHeader(accessToken);
    }
  }

  /**
   * @description 유저 정보 가져오기
   * @param type oauth 주체
   */
  async getUserInfo(type: TOAuthType) {
    let nickname = "";
    let id = 0;
    if (type === constants.OAUTH.KAKAO.NAME) {
      const kakaoUserData = await this.kakaoApiClient.getUserInfo();

      nickname = kakaoUserData.nickname;
      id = kakaoUserData.id;
    }

    const userInfo = {
      id,
      nickname,
    };

    return userInfo;
  }
}
