import { redisClient } from "@/loaders/database.loader";
import { TOAuthType } from "@/types/oauth";
import constants from "@/utils/constants";
import CError from "@/utils/error";
import { createJWTToken, verifyJWTToken } from "@/utils/jwt";
import { Service } from "typedi";

@Service()
export default class AuthService {
  private redisClient = redisClient;

  private readonly EXPRIED_ACCESS_TOKEN = constants.JWT.EXPRIED.ACCESS_TOKEN;

  private readonly EXPRIED_REFRESH_TOKEN = constants.JWT.EXPRIED.REFRESH_TOKEN;

  /**
   * @description 액세스토큰 만들기
   * @param nickname 닉네임
   * @param oAuthType oauth 종류
   * @returns new token
   */
  createAccessToken(nickname: string, oAuthType: TOAuthType) {
    const payload = {
      nickname,
      type: oAuthType,
    };
    const options = {
      expiresIn: this.EXPRIED_ACCESS_TOKEN,
    };

    const token = createJWTToken(payload, options);
    return token;
  }

  /**
   * @description 리프레시토큰 만들기
   * @param nickname 닉네임
   * @param oAuthType oauth 종류
   * @returns new token
   */
  createRefreshToken(nickname: string, oAuthType: TOAuthType) {
    const payload = {
      nickname,
      type: oAuthType,
    };
    const options = {
      expiresIn: this.EXPRIED_REFRESH_TOKEN,
    };

    const token = createJWTToken(payload, options);
    return token;
  }

  /**
   * @description 토큰 만들기
   * @param id user id
   * @param nickname 닉네임
   * @param oAuthType oauth 종류
   * @returns 토큰들
   */
  generateToken(nickname: string, oAuthType: TOAuthType) {
    const accessToken = this.createAccessToken(nickname, oAuthType);
    const refreshToken = this.createRefreshToken(nickname, oAuthType);

    const result = {
      accessToken,
      refreshToken,
    };

    return result;
  }

  /**
   * @description 리프레시 토큰 저장하기
   * @param key 유니크한 값
   * @param token 리프레시 토큰
   * @returns boolean
   */
  async saveRefreshToken(key: string, token: string) {
    await this.redisClient.set(key, token);

    return true;
  }

  /**
   * @description 액세스 토큰이 유효한지 확인하기
   * @param token jwt 토큰
   */
  static validateAccessToken(token: string) {
    const payload = verifyJWTToken<{ nickname: string; type: TOAuthType }>(token);

    return payload;
  }

  /**
   * @description 리프레시 토큰이 유효한지 확인하기
   * @param token jwt 토큰
   */
  async validateRefreshToken(token: string) {
    const payload = verifyJWTToken<{ nickname: string; type: TOAuthType }>(token);

    const originRefreshToken = await this.redisClient.get(payload.nickname);

    const isSameToken = token === originRefreshToken;

    if (!isSameToken) {
      throw new CError("Token is not same.. :(");
    }

    return payload;
  }
}
