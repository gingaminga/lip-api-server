import User from "@/databases/rdb/entities/user.entity";
import UserRepository from "@/databases/rdb/repositories/user.repository";
import { redisClient } from "@/loaders/database.loader";
import { TSocialType } from "@/types/social";
import { IAccessTokenPayload, IRefreshTokenPayload } from "@/types/token";
import { getRandomText } from "@/utils";
import constants from "@/utils/constants";
import CError from "@/utils/error";
import { createJWTToken, verifyJWTToken } from "@/utils/jwt";
import { SocialCommuicator } from "@/utils/social";
import { Inject, Service } from "typedi";

const checkExistUser = (userInfo: User | null): userInfo is User => !!userInfo;

@Service()
export default class AuthService {
  private readonly EXPRIED_ACCESS_TOKEN = constants.JWT.EXPRIED.ACCESS_TOKEN;

  private readonly EXPRIED_REFRESH_TOKEN = constants.JWT.EXPRIED.REFRESH_TOKEN;

  private socialCommuicator = SocialCommuicator;

  private redisClient = redisClient;

  constructor(@Inject() private userRepository: UserRepository) {
    /* empty */
  }

  /**
   * @description 닉네임이 중복되는지 여부 확인하기
   * @param nickname 닉네임
   * @returns 중복 여부
   */
  async checkDuplicateNickname(nickname: string) {
    const userInfo = await this.getUserInfo(nickname);

    if (!userInfo) {
      return false;
    }

    return true;
  }

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
   * @description 최종적인 닉네임 가져오기
   * @param nickname 닉네임
   * @returns 최종 닉네임
   */
  async getFinalNickname(nickname: string) {
    let finalNickname = nickname;

    while (true) {
      const isDuplicated = await this.checkDuplicateNickname(finalNickname);

      if (!isDuplicated) {
        break;
      }

      finalNickname = getRandomText();
    }

    return finalNickname;
  }

  /**
   * @description 소셜 유저 정보 가져오기
   * @param code 소셜 인가코드
   * @param socialType 소셜 종류
   */
  getSocialUserInfo(code: string, socialType: TSocialType) {
    return this.socialCommuicator.getUserInfo(socialType, code);
  }

  /**
   * @description 유저 정보 가져오기
   * @param nickname 닉네임
   * @param socialType 소셜 종류
   * @returns User | null
   */
  async getUserInfo(nickname: string, socialType?: TSocialType) {
    const userInfo = await this.userRepository.findUser(nickname, socialType);

    return userInfo;
  }

  /**
   * @description 회원가입하기
   * @param socialKey 소셜 id
   * @param socialType 소셜 종류
   * @param nickname 닉네임
   * @param email 이메일
   * @returns
   */
  async join(socialKey: string, socialType: TSocialType, nickname: string, email?: string) {
    const finalNickname = await this.getFinalNickname(nickname);

    const userInfo = await this.userRepository.saveUser(socialKey, socialType, finalNickname, email);

    return userInfo;
  }

  /**
   * @description 로그인하기
   * @param nickname 닉네임
   * @param socialType 소셜 종류
   * @param socialKey 소셜 id
   * @param email 이메일
   * @returns 로그인과 관련된 정보
   */
  async login(nickname: string, socialType: TSocialType, socialKey?: string, email?: string) {
    let userInfo = await this.getUserInfo(nickname, socialType);

    if (!checkExistUser(userInfo)) {
      if (socialKey) {
        // 회원가입
        userInfo = await this.join(socialKey, socialType, nickname, email);
      } else {
        throw new CError("Not exist user.. :(");
      }
    }

    const tokens = this.generateToken(userInfo.nickname, userInfo.socialType);

    await this.saveRefreshToken(userInfo.nickname, tokens.refreshToken);

    const loginInfo = { userInfo, ...tokens };

    return loginInfo;
  }

  /**
   * @description 로그인하기
   * @param code 소셜 인가코드
   * @param socialType 소셜 종류
   * @returns 로그인과 관련된 정보
   */
  async loginWithSocial(code: string, socialType: TSocialType) {
    const { email, id: socialKey, nickname } = await this.getSocialUserInfo(code, socialType);

    return this.login(nickname, socialType, socialKey, email);
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
    const payload = verifyJWTToken<IAccessTokenPayload>(token);

    return payload;
  }

  /**
   * @description 리프레시 토큰이 유효한지 확인하기
   * @param token jwt 토큰
   */
  async validateRefreshToken(token: string) {
    const payload = verifyJWTToken<IRefreshTokenPayload>(token);

    const originRefreshToken = await this.redisClient.get(payload.nickname);

    const isSameToken = token === originRefreshToken;

    if (!isSameToken) {
      throw new CError("Token is not same.. :(");
    }

    return payload;
  }
}
