import constants from "@/utils/constants";
import jwt, { SignOptions } from "jsonwebtoken";

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
