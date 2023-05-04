import { authService } from "@/loaders/service.loader";
import { createJWTToken } from "@/utils/jwt";

describe("Auth service test :)", () => {
  describe("Method createAccessToken", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Should create access token", () => {
      // given
      const type = "kakao";
      const nickname = "test";
      const accesstoken = "access token";
      jest.fn(createJWTToken).mockReturnValue(accesstoken);

      // when
      const token = authService.createAccessToken(nickname, type);

      // then
      expect(token).toBe(accesstoken);
    });
  });

  describe("Method createRefreshToken", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Should create refresh token", () => {
      // given
      const refreshToken = "refresh token";
      jest.fn(createJWTToken).mockReturnValue(refreshToken);

      // when
      const token = authService.createRefreshToken();

      // then
      expect(token).toBe(refreshToken);
    });
  });

  describe("Method generateToken", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Should get generate token", () => {
      // given
      const nickname = "";
      const type = "kakao";
      const accessToken = "access token";
      const refreshToken = "refresh token";
      jest.spyOn(authService, "createAccessToken").mockReturnValue(accessToken);
      jest.spyOn(authService, "createRefreshToken").mockReturnValue(refreshToken);

      // when
      const tokens = authService.generateToken(nickname, type);

      // then
      const compareResult = {
        accessToken,
        refreshToken,
      };
      expect(tokens).toEqual(compareResult);
    });
  });

  describe("Method saveRefreshToken", () => {
    const key = "key";
    const token = "refresh token";

    describe("Throw error test", () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      test("Should redis error", async () => {
        // given
        const error = new Error("Redis error");
        Object.defineProperty(authService, "redisClient", {
          value: {
            set: jest.fn().mockRejectedValue(error),
          },
        });

        // when
        const result = expect(authService.saveRefreshToken(key, token));

        // then
        await result.rejects.toThrowError(error);
      });
    });

    describe("No problem test", () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      test("Should save refresh token in redis", async () => {
        // given
        Object.defineProperty(authService, "redisClient", {
          value: {
            set: jest.fn().mockResolvedValue(undefined),
          },
        });

        // when
        const isSuccess = await authService.saveRefreshToken(key, token);

        // then
        expect(isSuccess).toBeTruthy();
      });
    });
  });
});
