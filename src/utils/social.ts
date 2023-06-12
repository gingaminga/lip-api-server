import { TSocialType } from "@/types/social";
import constants from "@/utils/constants";
import { KakaoApiClient } from "@/utils/lib/kakao-api";
import { KakaoAuthClient } from "@/utils/lib/kakao-auth";

class Social {
  private kakaoAuthClient = KakaoAuthClient;

  private kakaoApiClient = KakaoApiClient;

  /**
   * @description url 가져오기
   * @param type 소셜 타입
   * @returns url 주소
   */
  getURL(type: TSocialType) {
    let url = "";
    if (type === constants.SOCIAL.KAKAO.NAME) {
      url = this.kakaoAuthClient.getSocialURL();
    }

    return url;
  }

  /**
   * @description token 설정하기
   * @param type 소셜 주체
   * @param code 인가코드
   */
  async setToken(type: TSocialType, code: string) {
    if (type === constants.SOCIAL.KAKAO.NAME) {
      const { accessToken } = await this.kakaoAuthClient.getToken(code);

      this.kakaoApiClient.setAccessTokenInHeader(accessToken);
    }
  }

  /**
   * @description 유저 정보 가져오기
   * @param type 소셜 타입
   */
  async getUserInfo(type: TSocialType, code: string) {
    let nickname = "";
    let id = 0;
    if (type === constants.SOCIAL.KAKAO.NAME) {
      await this.setToken(type, code);
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

export const SocialCommuicator = new Social();
