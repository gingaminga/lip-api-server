import { getOAuthURLController } from "@/controllers/auth/oauth.controller";
import { GetOAuthURLRequestParamDTO } from "@/dto/oauth.dto";
import { oAuthService } from "@/loaders/service.loader";
import { ResponseDTO } from "@/types/express.custom";
import { Request } from "express";

describe("Get OAuth URL controller test :)", () => {
  const req = {} as Request;
  const res = {
    locals: {},
    result: jest.fn(),
  } as unknown as ResponseDTO<GetOAuthURLRequestParamDTO>;
  const next = jest.fn();

  beforeEach(() => {
    jest.spyOn(oAuthService, "getURL").mockReturnValue("url");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test(`Should OAuth type is kakao`, () => {
    // given
    res.locals.dto = new GetOAuthURLRequestParamDTO("kakao");

    // when
    getOAuthURLController(req, res, next);

    // then
    expect(res.result).toBeCalledTimes(1);

    const result = {
      url: "url",
    };
    expect(res.result).toHaveBeenCalledWith(result);
  });
});
