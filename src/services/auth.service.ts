import { dataSource } from "@/databases/rdb/client";
import User from "@/databases/rdb/entities/user.entity";
import { UserRepository } from "@/databases/rdb/repositories/user.repository";
import { redisClient } from "@/loaders/database.loader";
import { TSocialType } from "@/types/social";
import { IAccessTokenPayload, IRefreshTokenPayload } from "@/types/token";
import { getRandomText } from "@/utils";
import constants from "@/utils/constants";
import CError from "@/utils/error";
import { createJWTToken, verifyJWTToken } from "@/utils/jwt";
import { SocialCommuicator } from "@/utils/social";
import { Service } from "typedi";

const checkExistUser = (userInfo: User | null): userInfo is User => !!userInfo;

@Service()
export default class AuthService {
  private readonly EXPRIED_ACCESS_TOKEN = constants.JWT.EXPRIED.ACCESS_TOKEN;

  private readonly EXPRIED_REFRESH_TOKEN = constants.JWT.EXPRIED.REFRESH_TOKEN;

  private socialCommuicator = SocialCommuicator;

  private redisClient = redisClient;

  private userRepository = UserRepository;

  /**
   * @description 닉네임 변경하기
   * @param nickname 닉네임
   * @param userID 유저 id
   * @returns 변경 성공 여부
   */
  async changeNickname(nickname: string, userID: number) {
    const isDuplicate = await this.checkDuplicateNickname(nickname);

    if (isDuplicate) {
      throw new Error("Exist user.. :(");
    }

    const isSuccess = await this.userRepository.changeNickname(nickname, userID);

    await this.logout(nickname);

    return isSuccess;
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
   * @description access token으로 유저 정보 가져오기
   * @param token access token
   * @returns User | null
   */
  async getUserInfoByAccessToken(token: string) {
    const { nickname } = AuthService.validateAccessToken(token);

    const userInfo = await this.getUserInfo(nickname);

    if (!userInfo) {
      throw new CError("Not exist user.. :(");
    }

    return userInfo;
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
  async getUserInfo(nickname: string, socialType?: TSocialType, socialKey?: string) {
    if (!socialType && !socialKey) {
      const userInfo = await this.userRepository.findUserByNickname(nickname);

      return userInfo;
    }

    const userInfo = await this.userRepository.findUserBySocial(socialType, socialKey);

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
   * @param socialRefreshToken 소셜 리프레시 토큰
   * @returns 로그인과 관련된 정보
   */
  async login(
    nickname: string,
    socialType: TSocialType,
    socialKey?: string,
    email?: string,
    socialRefreshToken?: string,
  ) {
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

    await this.saveRefreshToken(userInfo.nickname, tokens.refreshToken, socialType, socialRefreshToken);

    const loginInfo = { userInfo, ...tokens };

    return loginInfo;
  }

  /**
   * @description 로그아웃
   * @param nickname 닉네임
   */
  async logout(nickname: string) {
    await this.removeToken(nickname);

    return true;
  }

  /**
   * @description 로그인하기
   * @param code 소셜 인가코드
   * @param socialType 소셜 종류
   * @returns 로그인과 관련된 정보
   */
  async loginWithSocial(code: string, socialType: TSocialType) {
    const { email, id: socialKey, nickname, socialRefrshToken } = await this.getSocialUserInfo(code, socialType);

    return this.login(nickname, socialType, socialKey, email, socialRefrshToken);
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
   * @description 토큰 삭제하기
   * @param nickname 닉네임
   */
  async removeToken(nickname: string) {
    await this.redisClient.del(nickname);
  }

  /**
   * @description 리프레시 토큰 저장하기
   * @param key 유니크한 값
   * @param token 리프레시 토큰
   * @param socialType 소셜 종류
   * @param socialToken 소셜 리프레시 토큰
   * @returns boolean
   */
  async saveRefreshToken(key: string, token: string, socialType?: TSocialType, socialToken?: string) {
    await this.redisClient.hset(key, constants.PROJECT_NAME, token);

    if (socialType && socialToken) {
      await this.redisClient.hset(key, socialType, socialToken);
    }

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

    const originRefreshToken = await this.redisClient.hget(payload.nickname, constants.PROJECT_NAME);

    const isSameToken = token === originRefreshToken;

    if (!isSameToken) {
      throw new CError("Token is not same.. :(");
    }

    return payload;
  }

  /**
   * @description 회원 탈퇴하기
   * @param userID 유저 id
   * @param nickname 닉네임
   * @returns 성공/실패
   */
  async withdrawal(userID: number, nickname: string) {
    return dataSource.transaction(async (manager) => {
      const userRepository = manager.withRepository(this.userRepository);

      // 토큰 삭제
      await this.removeToken(nickname);

      // 유저 삭제
      const isSuccess = await userRepository.removeUser(userID);

      return isSuccess;
    });
  }
}
