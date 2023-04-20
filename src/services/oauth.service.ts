import { TOAuthType } from "@/types/oauth";
import constants from "@/utils/constants";
import { KakaoAuthClient } from "@/utils/lib/kakao";
import { Service } from "typedi";

@Service()
export default class OAuthService {
  /**
   * @description url 가져오기
   * @param type oauth 주체
   * @returns url 주소
   */
  static getURL(type: TOAuthType) {
    let url = "";
    if (type === constants.OAUTH.KAKAO.NAME) {
      url = KakaoAuthClient.getOAuthURL();
    }

    return url;
  }
}
