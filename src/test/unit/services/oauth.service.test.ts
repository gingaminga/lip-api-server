import { oAuthService } from "@/loaders/service.loader";
import { KakaoAuthClient } from "@/utils/lib/kakao-auth";

describe("OAuth service test :)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Method getURL", () => {
    test("Should get kakao url", () => {
      // given
      // when
      const url = oAuthService.getURL("kakao");

      // then
      expect(url).toBe(KakaoAuthClient.getOAuthURL());
    });
  });
});
