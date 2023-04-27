import { redisClient } from "@/loaders/database.loader";
import { TOAuthType } from "@/types/oauth";
import constants from "@/utils/constants";
import { createJWTToken } from "@/utils/jwt";
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
   * @returns new token
   */
  createRefreshToken() {
    const payload = {};
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
  generateToken(id: number, nickname: string, oAuthType: TOAuthType) {
    const accessToken = this.createAccessToken(nickname, oAuthType);
    const refreshToken = this.createRefreshToken();

    const result = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };

    this.redisClient.set(String(id), refreshToken);

    return result;
  }
}
