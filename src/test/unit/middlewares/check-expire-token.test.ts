import { ReissueTokenDTO, ReissueTokenRequestParamDTO } from "@/dto/auth.dto";
import { authService } from "@/loaders/service.loader";
import { checkExpireAccessToken, checkExpireRefreshToken } from "@/middlewares/check-expire-token";
import AuthService from "@/services/auth.service";
import { ResponseDTO } from "@/types/express.custom";
import { IAccessTokenPayload } from "@/types/token";
import { ERROR_MESSAGE } from "@/utils/error";
import type { Request, Response } from "express";

describe("Check expire access token middleware test :)", () => {
  const req = {
    headers: {
      authorization: "",
    },
  } as unknown as Request;
  const res = {} as Response;
  const next = jest.fn();

  beforeEach(() => {
    req.headers.authorization = "";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test(`Should throw error not exist Bearer type`, async () => {
    // given
    const errorMessage = `${ERROR_MESSAGE.UNAUTHORIZED} ACCESS TOKEN`;

    // when
    // then
    await expect(() => {
      checkExpireAccessToken(req, res, next);
    }).toThrow(errorMessage);
  });

  test(`Should success`, () => {
    // given
    const payload = {} as IAccessTokenPayload;
    req.headers.authorization = "Bearer asdfasdfasdf";
    jest.spyOn(AuthService, "validateAccessToken").mockReturnValue(payload);

    // when
    checkExpireAccessToken(req, res, next);

    // then
    expect(next).toBeCalled();
  });
});

describe("Check expire refresh token middleware test :)", () => {
  const req = {} as Request;
  const res = {
    locals: {
      dto: new ReissueTokenRequestParamDTO("fake refresh token"),
    },
  } as unknown as ResponseDTO<ReissueTokenRequestParamDTO>;
  const next = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test(`Should throw error when expired refresh token`, async () => {
    // given
    const error = new Error(`${ERROR_MESSAGE.UNAUTHORIZED} REFRESH TOKEN`);
    jest.spyOn(authService, "validateRefreshToken").mockRejectedValue(error);

    // when
    const result = expect(checkExpireRefreshToken(req, res, next));

    // then
    await result.rejects.toThrowError(error);
  });

  test(`Should success`, async () => {
    // given
    const payload = {
      nickname: "fake nickname",
      type: "kakao",
    } as IAccessTokenPayload;
    jest.spyOn(authService, "validateRefreshToken").mockResolvedValue(payload);

    // when
    await checkExpireRefreshToken(req, res, next);

    // then
    expect(next).toBeCalled();
  });
});
