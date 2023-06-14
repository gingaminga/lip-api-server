import { TSocialType } from "@/types/social";
import constants from "@/utils/constants";
import { GoogleApiClient } from "@/utils/lib/google-api";
import { GoogleAuthClient } from "@/utils/lib/google-auth";
import { GoogleAuth2Client } from "@/utils/lib/google-auth-2";
import { KakaoApiClient } from "@/utils/lib/kakao-api";
import { KakaoAuthClient } from "@/utils/lib/kakao-auth";
import { NaverApiClient } from "@/utils/lib/naver-api";
import { NaverAuthClient } from "@/utils/lib/naver-auth";

class Social {
  private googleAuthClient = GoogleAuthClient;

  private googleAuth2Client = GoogleAuth2Client;

  private googleApiClient = GoogleApiClient;

  private kakaoAuthClient = KakaoAuthClient;

  private kakaoApiClient = KakaoApiClient;

  private naverAuthClient = NaverAuthClient;

  private naverApiClient = NaverApiClient;

  /**
   * @description url 가져오기
   * @param type 소셜 타입
   * @returns url 주소
   */
  getURL(type: TSocialType) {
    let url = "";
    if (type === constants.SOCIAL.KAKAO.NAME) {
      url = this.kakaoAuthClient.getSocialURL();
    } else if (type === constants.SOCIAL.NAVER.NAME) {
      url = this.naverAuthClient.getSocialURL();
    } else if (type === constants.SOCIAL.GOOGLE.NAME) {
      url = this.googleAuthClient.getSocialURL();
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
    } else if (type === constants.SOCIAL.NAVER.NAME) {
      const { accessToken } = await this.naverAuthClient.getToken(code);

      this.naverApiClient.setAccessTokenInHeader(accessToken);
    } else if (type === constants.SOCIAL.GOOGLE.NAME) {
      const { accessToken } = await this.googleAuth2Client.getToken(code);

      this.googleApiClient.setAccessTokenInHeader(accessToken);
    }
  }

  /**
   * @description 유저 정보 가져오기
   * @param type 소셜 타입
   */
  async getUserInfo(type: TSocialType, code: string) {
    let nickname = "";
    let id = "";
    if (type === constants.SOCIAL.KAKAO.NAME) {
      await this.setToken(type, code);
      const kakaoUserData = await this.kakaoApiClient.getUserInfo();

      nickname = kakaoUserData.nickname;
      id = String(kakaoUserData.id);
    } else if (type === constants.SOCIAL.NAVER.NAME) {
      await this.setToken(type, code);
      const naverUserData = await this.naverApiClient.getUserInfo();

      nickname = naverUserData.nickname;
      id = naverUserData.id;
    } else if (type === constants.SOCIAL.GOOGLE.NAME) {
      await this.setToken(type, code);
      const googleUserData = await this.googleApiClient.getUserInfo();

      nickname = googleUserData.nickname;
      id = googleUserData.id;
    }

    const userInfo = {
      id,
      nickname,
    };

    return userInfo;
  }
}

export const SocialCommuicator = new Social();
