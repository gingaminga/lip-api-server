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
   * @returs social token
   */
  async setToken(type: TSocialType, code: string) {
    let socialAccessToken = "";
    let socialRefreshToken = "";

    if (type === constants.SOCIAL.KAKAO.NAME) {
      const { accessToken, refreshToken } = await this.kakaoAuthClient.getToken(code);

      socialAccessToken = accessToken;
      socialRefreshToken = refreshToken;

      this.kakaoApiClient.setAccessTokenInHeader(accessToken);
    } else if (type === constants.SOCIAL.NAVER.NAME) {
      const { accessToken, refreshToken } = await this.naverAuthClient.getToken(code);

      socialAccessToken = accessToken;
      socialRefreshToken = refreshToken;

      this.naverApiClient.setAccessTokenInHeader(accessToken);
    } else if (type === constants.SOCIAL.GOOGLE.NAME) {
      const { accessToken, refreshToken } = await this.googleAuth2Client.getToken(code);

      socialAccessToken = accessToken;
      socialRefreshToken = refreshToken;

      this.googleApiClient.setAccessTokenInHeader(accessToken);
    }

    return {
      accessToken: socialAccessToken,
      refreshToken: socialRefreshToken,
    };
  }

  /**
   * @description 유저 정보 가져오기
   * @param type 소셜 타입
   */
  async getUserInfo(type: TSocialType, code: string) {
    let nickname = "";
    let id = "";
    let email: undefined | string;
    let socialAccessToken = "";
    let socialRefrshToken = "";

    if (type === constants.SOCIAL.KAKAO.NAME) {
      const { accessToken, refreshToken } = await this.setToken(type, code);
      const kakaoUserData = await this.kakaoApiClient.getUserInfo();

      nickname = kakaoUserData.nickname;
      id = String(kakaoUserData.id);
      email = kakaoUserData.email;
      socialAccessToken = accessToken;
      socialRefrshToken = refreshToken;
    } else if (type === constants.SOCIAL.NAVER.NAME) {
      const { accessToken, refreshToken } = await this.setToken(type, code);
      const naverUserData = await this.naverApiClient.getUserInfo();

      nickname = naverUserData.nickname;
      id = naverUserData.id;
      email = naverUserData.email;
      socialAccessToken = accessToken;
      socialRefrshToken = refreshToken;
    } else if (type === constants.SOCIAL.GOOGLE.NAME) {
      const { accessToken, refreshToken } = await this.setToken(type, code);
      const googleUserData = await this.googleApiClient.getUserInfo();

      nickname = googleUserData.nickname;
      id = googleUserData.id;
      email = googleUserData.email;
      socialAccessToken = accessToken;
      socialRefrshToken = refreshToken;
    }

    const userInfo = {
      email,
      id,
      nickname,
      socialAccessToken,
      socialRefrshToken,
    };

    return userInfo;
  }

  /**
   * @description 연결 끊기
   * @param type 소셜 종류
   * @param refreshToken 리프레시 토큰
   * @returns 성공 유무
   */
  async unlink(type: TSocialType, refreshToken: string) {
    let isSuccess = false;

    if (type === constants.SOCIAL.KAKAO.NAME) {
      const { accessToken } = await this.kakaoAuthClient.getRenewToken(refreshToken);
      this.kakaoApiClient.setAccessTokenInHeader(accessToken);

      isSuccess = await this.kakaoApiClient.unlink();
    } else if (type === constants.SOCIAL.NAVER.NAME) {
      const { accessToken } = await this.naverAuthClient.getRenewToken(refreshToken);
      isSuccess = await this.naverAuthClient.unlink(accessToken);
    } else if (type === constants.SOCIAL.GOOGLE.NAME) {
      const { accessToken } = await this.googleAuth2Client.getRenewToken(refreshToken);
      isSuccess = await this.googleAuth2Client.unlink(accessToken);
    }

    return isSuccess;
  }
}

export const SocialCommuicator = new Social();
