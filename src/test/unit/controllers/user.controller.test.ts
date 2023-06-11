import { loginController } from "@/controllers/user.controller";
import User from "@/databases/rdb/entities/user.entity";
import { LoginRequestParamDTO } from "@/dto/user.dto";
import { userService } from "@/loaders/service.loader";
import { ResponseDTO } from "@/types/express.custom";
import { Request } from "express";

describe("Login controller test :)", () => {
  const req = {} as Request;
  const next = jest.fn();

  const code = "12345678";
  const type = "kakao";

  const res = {
    locals: {
      dto: new LoginRequestParamDTO(type, code),
    },
    result: jest.fn(),
  } as unknown as ResponseDTO<LoginRequestParamDTO>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test(`Should failure login`, async () => {
    // given
    const error = new Error("Failure login with oauth");
    jest.spyOn(userService, "loginWithOAuth").mockRejectedValue(error);

    // when
    const result = expect(loginController(req, res, next));

    // then
    await result.rejects.toThrowError(error);
  });

  test(`Should success login`, async () => {
    // given
    const result = {
      accessToken: "access token",
      refreshToken: "refresh token",
      userInfo: {} as User,
    };
    jest.spyOn(userService, "loginWithOAuth").mockResolvedValue(result);

    // when
    await loginController(req, res, next);

    // then
    expect(res.result).toBeCalledTimes(1);
    expect(res.result).toHaveBeenCalledWith(result);
  });
});
