import { getOAuthURLController, oAuthLoginController } from "@/controllers/auth/oauth.controller";
import User from "@/databases/rdb/entities/user.entity";
import { GetOAuthURLRequestParamDTO, OAuthLoginRequestParamDTO } from "@/dto/oauth.dto";
import { oAuthService, userService } from "@/loaders/service.loader";
import { ResponseDTO } from "@/types/express.custom";
import { Request } from "express";

describe("OAuth controller test :)", () => {
  const next = jest.fn();

  describe("Get OAuth URL controller test :)", () => {
    const req = {} as Request;

    beforeEach(() => {
      const fakeURL = "test.com";
      jest.spyOn(oAuthService, "getURL").mockReturnValue(fakeURL);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test(`Should success OAuth URL`, () => {
      // given
      const res = {
        locals: {
          dto: new GetOAuthURLRequestParamDTO("kakao"),
        },
        result: jest.fn(),
      } as unknown as ResponseDTO<GetOAuthURLRequestParamDTO>;

      // when
      getOAuthURLController(req, res, next);

      // then
      expect(res.result).toBeCalledTimes(1);

      const result = {
        url: "test.com",
      };
      expect(res.result).toHaveBeenCalledWith(result);
    });
  });

  describe("OAuth login controller test :)", () => {
    const req = {} as Request;
    const fakeResult = {
      accessToken: "access token",
      refreshToken: "refresh token",
      userInfo: {} as User,
    };
    const fakeUserInfo = {
      id: 1,
      nickname: "",
    };

    beforeEach(() => {
      jest.spyOn(oAuthService, "getUserInfo").mockResolvedValue(fakeUserInfo);
      jest.spyOn(userService, "login").mockResolvedValue(fakeResult);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe("Throw error test :)", () => {
      const res = {
        locals: {
          dto: {
            code: "code",
            type: "oauth type",
          },
        },
        result: jest.fn(),
      } as unknown as ResponseDTO<OAuthLoginRequestParamDTO>;

      afterEach(() => {
        jest.clearAllMocks();
      });

      test(`Should oAuthService.getUserInfo method error`, async () => {
        // given
        const error = new Error("Get user info error");
        jest.spyOn(oAuthService, "getUserInfo").mockRejectedValue(error);

        // when
        // then
        await expect(oAuthLoginController(req, res, next)).rejects.toThrowError(error);
      });

      test(`Should userService.login method error`, async () => {
        // given
        const error = new Error("login error");
        jest.spyOn(userService, "login").mockRejectedValue(error);

        // when
        // then
        await expect(oAuthLoginController(req, res, next)).rejects.toThrowError(error);
      });
    });

    describe("No problem test :)", () => {
      test(`Should success OAuth login`, async () => {
        // given
        const res = {
          locals: {
            dto: new OAuthLoginRequestParamDTO("kakao", "1234567890"),
          },
          result: jest.fn(),
        } as unknown as ResponseDTO<OAuthLoginRequestParamDTO>;

        // when
        await oAuthLoginController(req, res, next);

        // then
        expect(res.result).toBeCalledTimes(1);
        expect(res.result).toHaveBeenCalledWith(fakeResult);
      });
    });
  });
});
