import OAuthService from "@/services/oauth.service";
import { KakaoAuthClient } from "@/utils/lib/kakao";

describe("OAuth service test :)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Method getURL", () => {
    test("Should get url", () => {
      // given
      // when
      const url = OAuthService.getURL("kakao");

      // then
      expect(url).toBe(KakaoAuthClient.getOAuthURL());
    });
  });
});
