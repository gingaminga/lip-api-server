import User from "@/databases/rdb/entities/user.entity";
import UserRepository from "@/databases/rdb/repositories/user.repository";
import AuthService from "@/services/auth.service";
import { TSocialType } from "@/types/social";
import { getRandomText } from "@/utils";
import CError from "@/utils/error";
import { SocialCommuicator } from "@/utils/social";
import { Inject, Service } from "typedi";

const checkExistUser = (userInfo: User | null): userInfo is User => !!userInfo;

@Service()
export default class UserService {
  private socialCommuicator = SocialCommuicator;

  constructor(@Inject() private authService: AuthService, @Inject() private userRepository: UserRepository) {
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
   * @returns
   */
  async join(socialKey: string, socialType: TSocialType, nickname: string) {
    const finalNickname = await this.getFinalNickname(nickname);

    const userInfo = await this.userRepository.saveUser(socialKey, socialType, finalNickname);

    return userInfo;
  }

  /**
   * @description 로그인하기
   * @param nickname 닉네임
   * @param socialType 소셜 종류
   * @param socialKey 소셜 id
   * @returns 로그인과 관련된 정보
   */
  async login(nickname: string, socialType: TSocialType, socialKey?: string) {
    let userInfo = await this.getUserInfo(nickname, socialType);

    if (!checkExistUser(userInfo)) {
      if (socialKey) {
        // 회원가입
        userInfo = await this.join(socialKey, socialType, nickname);
      } else {
        throw new CError("Not exist user.. :(");
      }
    }

    const tokens = this.authService.generateToken(userInfo.nickname, userInfo.socialType);

    await this.authService.saveRefreshToken(userInfo.nickname, tokens.refreshToken);

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
    const { id: socialKey, nickname } = await this.getSocialUserInfo(code, socialType);

    return this.login(nickname, socialType, socialKey);
  }
}
