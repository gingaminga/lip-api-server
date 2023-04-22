import { getOAuthURLController } from "@/controllers/auth/oauth.controller";
import { GetOAuthURLRequestParamDTO } from "@/dto/oauth.dto";
import OAuthService from "@/services/oauth.service";
import { ResponseDTO } from "@/types/express.custom";
import { KakaoAuthClient } from "@/utils/lib/kakao";
import { Request } from "express";

describe("Get OAuth URL controller test :)", () => {
  const req = {} as Request;
  const res = {
    locals: {},
    result: jest.fn(),
  } as unknown as ResponseDTO<GetOAuthURLRequestParamDTO>;
  const next = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test(`Should OAuth type is kakao`, () => {
    // given
    res.locals.dto = new GetOAuthURLRequestParamDTO("kakao");

    const url = KakaoAuthClient.getOAuthURL();
    OAuthService.getURL = jest.fn().mockReturnValue(url);

    // when
    getOAuthURLController(req, res, next);

    // then
    expect(res.result).toBeCalledTimes(1);

    const result = {
      url,
    };
    expect(res.result).toHaveBeenCalledWith(result);
  });
});
