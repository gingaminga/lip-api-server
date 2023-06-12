import { GetSocialURLRequestParamDTO } from "@/dto/oauth.dto";
import { ResponseDTO } from "@/types/express.custom";
import constants from "@/utils/constants";
import { getSocialURLSchema } from "@/validators/schema/oauth.schema";
import { getSocialURLValidator } from "@/validators/validator/oauth.validator";
import { Request } from "express";

const req = {
  query: {},
} as unknown as Request;
const res = {
  locals: {},
} as unknown as ResponseDTO<GetSocialURLRequestParamDTO>;
const next = jest.fn();

describe("Validator check status test :)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test(`Should throw error when parameter is invalid`, async () => {
    // given
    const error = new Error("validate error");
    jest.spyOn(getSocialURLSchema, "validateAsync").mockRejectedValue(error);

    // when
    // then
    await expect(getSocialURLValidator(req, res, next)).rejects.toThrowError(error);
  });

  test(`Should success when parameter is ${constants.OAUTH.KAKAO.NAME} value`, async () => {
    // given
    res.locals.dto = new GetSocialURLRequestParamDTO("kakao");
    jest.spyOn(getSocialURLSchema, "validateAsync").mockResolvedValue({
      type: "kakao",
    });

    // when
    await getSocialURLValidator(req, res, next);

    // then
    expect(res.locals.dto).toEqual(new GetSocialURLRequestParamDTO("kakao"));
    expect(next).toBeCalled();
  });
});
