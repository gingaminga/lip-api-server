import constants from "@/utils/constants";
import CError, { ERROR_MESSAGE } from "@/utils/error";
import HTTP_STATUS_CODE from "@/utils/http-status-code";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const checkJWTPayload = (data: string | JwtPayload): data is JwtPayload => typeof data !== "string";

/**
 * @description 토큰 생성하기
 * @param payload
 * @param options jwt 옵션
 * @returns new token
 */
export const createJWTToken = (payload: object, options: SignOptions) => {
  const token = jwt.sign(payload, constants.JWT.KEY, options);

  return token;
};

/**
 * @description 토큰 해석하기
 * @param token 토큰
 * @returns 토큰 해석 결과
 */
export const verifyJWTToken = <T>(token: string) => {
  const decodedData = jwt.verify(token, constants.JWT.KEY);

  if (!checkJWTPayload(decodedData)) {
    throw new CError(ERROR_MESSAGE.INTERNAL_SERVER_ERROR, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }

  return decodedData as JwtPayload & T;
};
