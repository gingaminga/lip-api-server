import { getSocialURLController, reissueTokenController } from "@/controllers/auth.controller";
import User from "@/databases/rdb/entities/user.entity";
import { GetSocialURLRequestParamDTO, ReissueTokenDTO } from "@/dto/auth.dto";
import { authService, userService } from "@/loaders/service.loader";
import { ResponseDTO } from "@/types/express.custom";
import { Request } from "express";

describe("Get Social URL controller test :)", () => {
  const req = {} as Request;
  let res = {} as unknown as ResponseDTO<GetSocialURLRequestParamDTO>;
  const next = jest.fn();

  beforeAll(() => {
    res = {
      locals: {
        requestDTO: new GetSocialURLRequestParamDTO("kakao"),
      },
      result: jest.fn(),
    } as unknown as ResponseDTO<GetSocialURLRequestParamDTO>;
  });

  beforeEach(() => {
    const fakeURL = "test.com";
    jest.spyOn(authService, "getSocialURL").mockReturnValue(fakeURL);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test(`Should success Social URL`, () => {
    // given
    const result = {
      url: "test.com",
    };

    // when
    getSocialURLController(req, res, next);

    // then
    expect(res.result).toBeCalledTimes(1);

    expect(res.result).toHaveBeenCalledWith(result);
  });
});

describe("Reissue token controller test :)", () => {
  const req = {} as Request;
  const next = jest.fn();

  const token = "12345678";
  const nickname = "fake";
  const type = "kakao";

  const res = {
    locals: {
      requestDTO: new ReissueTokenDTO(token, nickname, type),
    },
    result: jest.fn(),
  } as unknown as ResponseDTO<ReissueTokenDTO>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test(`Should failure reissue token`, async () => {
    // given
    const error = new Error("Failure login");
    jest.spyOn(userService, "login").mockRejectedValue(error);

    // when
    const result = expect(reissueTokenController(req, res, next));

    // then
    await result.rejects.toThrowError(error);
  });

  test(`Should success reissue token`, async () => {
    // given
    const result = {
      accessToken: "access token",
      refreshToken: "refresh token",
      userInfo: {} as User,
    };
    jest.spyOn(userService, "login").mockResolvedValue(result);

    // when
    await reissueTokenController(req, res, next);

    // then
    expect(res.result).toBeCalledTimes(1);
    expect(res.result).toHaveBeenCalledWith(result);
  });
});
