import { oAuthService } from "@/loaders/service.loader";

describe("OAuth service test :)", () => {
  describe("Method getURL test :)", () => {
    const fakeURL = "test.com";

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Should get kakao url", () => {
      // given
      const type = "kakao";
      Object.defineProperty(oAuthService, "kakaoAuthClient", {
        value: {
          getOAuthURL: jest.fn().mockReturnValue(fakeURL),
        },
      });

      // when
      const url = oAuthService.getURL(type);

      // then
      expect(url).toBe(fakeURL);
    });
  });

  describe("Method setToken test :)", () => {
    const code = "12341234";

    describe("Throw error test :)", () => {
      beforeAll(() => {
        Object.defineProperty(oAuthService, "kakaoApiClient", {
          value: {
            setAccessTokenInHeader: jest.fn().mockReturnValue(undefined),
          },
        });
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      test("Should kakaoAuthClient getToken method error", async () => {
        // given
        const type = "kakao";
        const error = new Error("Get kakao token error");
        Object.defineProperty(oAuthService, "kakaoAuthClient", {
          value: {
            getToken: jest.fn().mockRejectedValue(error),
          },
        });

        // when
        const result = expect(oAuthService.setToken(type, code));

        // then
        await result.rejects.toThrowError(error);
      });
    });
  });

  describe("Method getUserInfo test :)", () => {
    const fakeUserInfo = {
      id: 0,
      nickname: "",
    };

    describe("Throw error test :)", () => {
      const type = "kakao";
      const code = "12341234";

      afterEach(() => {
        jest.clearAllMocks();
      });

      beforeEach(() => {
        jest.spyOn(oAuthService, "setToken").mockResolvedValue();

        Object.defineProperty(oAuthService, "kakaoApiClient", {
          value: {
            getUserInfo: jest.fn().mockResolvedValue(fakeUserInfo),
          },
        });
      });

      test("Should oAuthService setToken method error", async () => {
        // given

        const error = new Error("Set token error");
        jest.spyOn(oAuthService, "setToken").mockRejectedValue(error);

        // when
        const result = expect(oAuthService.getUserInfo(type, code));

        // then
        await result.rejects.toThrowError(error);
      });

      test("Should get kakao user info error", async () => {
        // given
        const error = new Error("Get user info error");
        Object.defineProperty(oAuthService, "kakaoApiClient", {
          value: {
            getUserInfo: jest.fn().mockRejectedValue(error),
          },
        });

        // when
        const result = expect(oAuthService.getUserInfo(type, code));

        // then
        await result.rejects.toThrowError(error);
      });
    });

    describe("No problem test :)", () => {
      const code = "12341234";

      test("Should get kakao user info", async () => {
        // given
        const type = "kakao";

        // when
        const userInfo = await oAuthService.getUserInfo(type, code);

        // then
        expect(userInfo).toEqual(fakeUserInfo);
      });
    });
  });
});
