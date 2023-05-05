import { GetOAuthURLRequestParamDTO } from "@/dto/oauth.dto";
import { ResponseDTO } from "@/types/express.custom";
import constants from "@/utils/constants";
import { getOAuthURLSchema } from "@/validators/schema/oauth.schema";
import { getOAuthURLValidator } from "@/validators/validator/oauth.validator";
import { Request } from "express";

const req = {
  query: {},
} as unknown as Request;
const res = {
  locals: {},
} as unknown as ResponseDTO<GetOAuthURLRequestParamDTO>;
const next = jest.fn();

describe("Validator check status test :)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test(`Should throw error when parameter is invalid`, async () => {
    // given
    const error = new Error("validate error");
    jest.spyOn(getOAuthURLSchema, "validateAsync").mockRejectedValue(error);

    // when
    // then
    await expect(getOAuthURLValidator(req, res, next)).rejects.toThrowError(error);
  });

  test(`Should success when parameter is ${constants.OAUTH.KAKAO.NAME} value`, async () => {
    // given
    res.locals.dto = new GetOAuthURLRequestParamDTO("kakao");
    jest.spyOn(getOAuthURLSchema, "validateAsync").mockResolvedValue({
      type: "kakao",
    });

    // when
    await getOAuthURLValidator(req, res, next);

    // then
    expect(res.locals.dto).toEqual(new GetOAuthURLRequestParamDTO("kakao"));
    expect(next).toBeCalled();
  });
});
