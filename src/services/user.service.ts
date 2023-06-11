import User from "@/databases/rdb/entities/user.entity";
import UserRepository from "@/databases/rdb/repositories/user.repository";
import AuthService from "@/services/auth.service";
import { TOAuthType } from "@/types/oauth";
import { getRandomText } from "@/utils";
import CError from "@/utils/error";
import { OAuthCommuicator } from "@/utils/oauth";
import { Inject, Service } from "typedi";

const checkExistUser = (userInfo: User | null): userInfo is User => !!userInfo;

@Service()
export default class UserService {
  private oAuthCommuicator = OAuthCommuicator;

  constructor(@Inject() private authService: AuthService, @Inject() private userRepository: UserRepository) {
    /* empty */
  }

  /**
   * @description 닉네임이 중복되는지 여부 확인하기
   * @param nickname 닉네임
   * @returns 중복 여부
   */
  async checkDuplicateNickname(nickname: string) {
    const userInfo = await this.getUserInfoByNickname(nickname);

    if (!userInfo) {
      return false;
    }

    return true;
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
   * @description oauth 유저 정보 가져오기
   * @param code oauth 인가코드
   * @param oAuthType oauth 종류
   */
  getOAuthUserInfo(code: string, oAuthType: TOAuthType) {
    return this.oAuthCommuicator.getUserInfo(oAuthType, code);
  }

  /**
   * @description 닉네임으로 유저 정보 가져오기
   * @param nickname 닉네임
   * @returns User | null
   */
  async getUserInfoByNickname(nickname: string) {
    const userInfo = await this.userRepository.findUserByNickname(nickname);

    return userInfo;
  }

  /**
   * @description 회원가입하기
   * @param oAuthKey OAuth id
   * @param oAuthType OAuth 종류
   * @param nickname 닉네임
   * @returns
   */
  async join(oAuthKey: number, oAuthType: TOAuthType, nickname: string) {
    const finalNickname = await this.getFinalNickname(nickname);

    const userInfo = await this.userRepository.saveUser(oAuthKey, oAuthType, finalNickname);

    return userInfo;
  }

  /**
   * @description 로그인하기
   * @param nickname 닉네임
   * @param oAuthType OAuth 종류
   * @param oAuthKey OAuth id
   * @returns 로그인과 관련된 정보
   */
  async login(nickname: string, oAuthType: TOAuthType, oAuthKey?: number) {
    let userInfo = await this.getUserInfoByNickname(nickname);

    if (!checkExistUser(userInfo)) {
      if (oAuthKey) {
        // 회원가입
        userInfo = await this.join(oAuthKey, oAuthType, nickname);
      } else {
        throw new CError("Not exist user.. :(");
      }
    }

    const tokens = this.authService.generateToken(userInfo.nickname, userInfo.oauthType);

    await this.authService.saveRefreshToken(userInfo.nickname, tokens.refreshToken);

    const loginInfo = { userInfo, ...tokens };

    return loginInfo;
  }

  /**
   * @description 로그인하기
   * @param code oauth 인가코드
   * @param oAuthType OAuth 종류
   * @returns 로그인과 관련된 정보
   */
  async loginWithOAuth(code: string, oAuthType: TOAuthType) {
    const { id: oAuthKey, nickname } = await this.getOAuthUserInfo(code, oAuthType);

    return this.login(nickname, oAuthType, oAuthKey);
  }
}
