import { getOAuthURLController } from "@/controllers/oauth.controller";
import { GetOAuthURLRequestParamDTO } from "@/dto/oauth.dto";
import { oAuthService } from "@/loaders/service.loader";
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
});
