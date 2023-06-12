import { redisClient } from "@/loaders/database.loader";
import { TSocialType } from "@/types/social";
import constants from "@/utils/constants";
import CError from "@/utils/error";
import { createJWTToken, verifyJWTToken } from "@/utils/jwt";
import { SocialCommuicator } from "@/utils/social";
import { Service } from "typedi";

@Service()
export default class AuthService {
  private readonly EXPRIED_ACCESS_TOKEN = constants.JWT.EXPRIED.ACCESS_TOKEN;

  private readonly EXPRIED_REFRESH_TOKEN = constants.JWT.EXPRIED.REFRESH_TOKEN;

  private socialCommuicator = SocialCommuicator;

  private redisClient = redisClient;

  /**
   * @description 액세스토큰 만들기
   * @param nickname 닉네임
   * @param socialType 소셜 종류
   * @returns new token
   */
  createAccessToken(nickname: string, socialType: TSocialType) {
    const payload = {
      nickname,
      type: socialType,
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
   * @param socialType 소셜 종류
   * @returns new token
   */
  createRefreshToken(nickname: string, socialType: TSocialType) {
    const payload = {
      nickname,
      type: socialType,
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
   * @param socialType 소셜 종류
   * @returns 토큰들
   */
  generateToken(nickname: string, socialType: TSocialType) {
    const accessToken = this.createAccessToken(nickname, socialType);
    const refreshToken = this.createRefreshToken(nickname, socialType);

    const result = {
      accessToken,
      refreshToken,
    };

    return result;
  }

  /**
   * @description 소셜 url 가져오기
   * @param socialType 소셜 종류
   * @returns 소셜 url
   */
  getSocialURL(socialType: TSocialType) {
    return this.socialCommuicator.getURL(socialType);
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
    const payload = verifyJWTToken<{ nickname: string; type: TSocialType }>(token);

    return payload;
  }

  /**
   * @description 리프레시 토큰이 유효한지 확인하기
   * @param token jwt 토큰
   */
  async validateRefreshToken(token: string) {
    const payload = verifyJWTToken<{ nickname: string; type: TSocialType }>(token);

    const originRefreshToken = await this.redisClient.get(payload.nickname);

    const isSameToken = token === originRefreshToken;

    if (!isSameToken) {
      throw new CError("Token is not same.. :(");
    }

    return payload;
  }
}
