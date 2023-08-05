import { dataSource } from "@/databases/rdb/client";
import User from "@/databases/rdb/entities/user.entity";
import { FcmTokenRepository } from "@/databases/rdb/repositories/fcm-token.repository";
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

  private fcmTokenRepository = FcmTokenRepository;

  private socialCommuicator = SocialCommuicator;

  private redisClient = redisClient;

  private userRepository = UserRepository;

  /**
   * @description 닉네임 변경하기
   * @param nickname 닉네임
   * @param userID 유저 id
   * @param deviceToken 디바이스 토큰
   * @returns 변경 성공 여부
   */
  async changeNickname(nickname: string, userID: number, deviceToken?: string) {
    return dataSource.transaction(async (manager) => {
      const fcmTokenRepository = manager.withRepository(this.fcmTokenRepository);
      const userRepository = manager.withRepository(this.userRepository);

      const isDuplicate = await this.checkDuplicateNickname(nickname);

      if (isDuplicate) {
        throw new Error("Exist user.. :(");
      }

      const isSuccess = await userRepository.changeNickname(nickname, userID);

      if (deviceToken) {
        await fcmTokenRepository.removeDeviceToken(deviceToken, userID);
      }

      await this.removeToken(userID);

      return isSuccess;
    });
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
   * @description 리프레시 토큰 유효성 확인하기
   * @param key 레디스 field 값
   * @param compareToken 비교 대상 토큰
   */
  async checkRefreshToken(key: number, compareToken: string) {
    const originRefreshToken = await this.redisClient.hget(constants.PROJECT_NAME, String(key));

    const isSameToken = compareToken === originRefreshToken;

    if (!isSameToken) {
      throw new CError("Token is not same.. :(");
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
   * @param userID 유저 id
   * @param nickname 닉네임
   * @param socialType 소셜 종류
   * @returns 토큰들
   */
  async generateToken(userID: number, nickname: string, socialType: TSocialType) {
    const accessToken = this.createAccessToken(nickname, socialType);

    let refreshToken = await this.redisClient.hget(constants.PROJECT_NAME, String(userID));

    if (!refreshToken) {
      refreshToken = this.createRefreshToken(nickname, socialType);
    }

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

    const regExp = /^[a-zA-Z0-9가-힣]{2,20}$/;

    while (true) {
      if (regExp.test(finalNickname)) {
        // 닉네임 규칙에 맞음
        const isDuplicated = await this.checkDuplicateNickname(finalNickname);

        if (!isDuplicated) {
          break;
        }
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
    const { nickname } = verifyJWTToken<IAccessTokenPayload>(token);

    const userInfo = await this.getUserInfo(nickname);

    if (!userInfo) {
      throw new CError("Not exist user.. :(");
    }

    return userInfo;
  }

  /**
   * @description refresh token으로 유저 정보 가져오기
   * @param token refresh token
   */
  async getUserInfoByRefreshToken(token: string) {
    const { nickname } = verifyJWTToken<IRefreshTokenPayload>(token);

    const userInfo = await this.getUserInfo(nickname);

    if (!userInfo) {
      throw new CError("Not exist user.. :(");
    }

    await this.checkRefreshToken(userInfo.id, token);

    return userInfo;
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
    return dataSource.transaction(async (manager) => {
      const userRepository = manager.withRepository(this.userRepository);

      let userInfo = await this.getUserInfo(nickname, socialType, socialKey);

      if (!checkExistUser(userInfo)) {
        if (socialKey) {
          // 회원가입
          const finalNickname = await this.getFinalNickname(nickname);
          userInfo = await userRepository.saveUser(socialKey, socialType, finalNickname, email);
        } else {
          throw new CError("Not exist user.. :(");
        }
      }

      const tokens = await this.generateToken(userInfo.id, userInfo.nickname, userInfo.socialType);
      await this.saveRefreshToken(socialType, userInfo.id, tokens.refreshToken, socialKey, socialRefreshToken);

      const loginInfo = { userInfo, ...tokens };

      return loginInfo;
    });
  }

  /**
   * @description 로그아웃
   * @param userID user id
   * @param deviceToken 디바이스 토큰
   */
  async logout(userID: number, deviceToken?: string) {
    if (deviceToken) {
      await this.fcmTokenRepository.removeDeviceToken(deviceToken, userID);
    }

    return true;
  }

  /**
   * @description 로그인하기
   * @param code 소셜 인가코드
   * @param socialType 소셜 종류
   * @returns 로그인과 관련된 정보
   */
  async loginWithSocial(code: string, socialType: TSocialType) {
    const {
      email,
      id: socialKey,
      nickname,
      socialRefrshToken,
    } = await this.socialCommuicator.getUserInfo(socialType, code);

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
   * @param userID 유저 id
   * @param socialType 소셜 종류
   * @param socialKey 소셜 id
   * @returns true
   */
  async removeToken(userID: number, socialType?: TSocialType, socialKey?: string) {
    await this.redisClient.hdel(constants.PROJECT_NAME, String(userID));

    if (socialType && socialKey) {
      await this.redisClient.hdel(socialType, socialKey);
    }

    return true;
  }

  /**
   * @description 소셜 토큰 가져오기
   * @param socialType 소셜 종류
   * @param socialKey 소셜 id
   */
  async getSocialRefrshToken(socialType: TSocialType, socialKey: string) {
    const refreshToken = await this.redisClient.hget(socialType, socialKey);

    return refreshToken;
  }

  /**
   * @description 리프레시 토큰 저장하기
   * @param key 유니크한 값
   * @param token 리프레시 토큰
   * @param socialType 소셜 종류
   * @param socialToken 소셜 리프레시 토큰
   * @returns boolean
   */
  async saveRefreshToken(
    socialType: TSocialType,
    userID: number,
    token: string,
    socialKey?: string,
    socialToken?: string,
  ) {
    await this.redisClient.hset(constants.PROJECT_NAME, String(userID), token);

    if (socialKey && socialToken) {
      await this.redisClient.hset(socialType, socialKey, socialToken);
    }

    return true;
  }

  /**
   * @description 회원 탈퇴하기
   * @param userID 유저 id
   * @param socialType 소셜 종류
   * @param socialKey 소셜 키
   * @returns 성공/실패
   */
  async withdrawal(userID: number, socialType: TSocialType, socialKey: string) {
    return dataSource.transaction(async (manager) => {
      const userRepository = manager.withRepository(this.userRepository);

      const refreshToken = await this.getSocialRefrshToken(socialType, socialKey);

      if (refreshToken) {
        // 토큰이 있을 경우에만 social 링크 끊기
        try {
          await this.socialCommuicator.unlink(socialType, refreshToken);
        } catch (error) {
          // 에러가 발생하더라도 회원탈퇴 진행
          /** nothing to do */
        }
      }

      // 토큰 삭제
      await this.removeToken(userID, socialType, socialKey);

      // 유저 삭제
      const isSuccess = await userRepository.removeUser(userID);

      return isSuccess;
    });
  }
}
