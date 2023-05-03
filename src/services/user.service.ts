import User from "@/databases/rdb/entities/user.entity";
import UserRepository from "@/databases/rdb/repositories/user.repository";
import AuthService from "@/services/auth.service";
import { TOAuthType } from "@/types/oauth";
import { getRandomText } from "@/utils";
import { Inject, Service } from "typedi";

const checkExistUser = (userInfo: User | null): userInfo is User => !!userInfo;

@Service()
export default class UserService {
  constructor(@Inject() private authService: AuthService, @Inject() private userRepository: UserRepository) {
    /* empty */
  }

  /**
   * @description 닉네임이 중복되는지 여부 확인하기
   * @param nickname 닉네임
   * @returns 중복 여부
   */
  async checkDuplicateNickname(nickname: string) {
    const userInfo = await this.userRepository.findUserByNickname(nickname);

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
   * @description 유저 정보 가져오기
   * @param oAuthKey OAuth id
   * @param oAuthType OAuth 종류
   * @returns User | null
   */
  async getUserInfo(oAuthKey: number, oAuthType: TOAuthType) {
    const userInfo = await this.userRepository.findUserByOAuth(oAuthKey, oAuthType);

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
   * @param oAuthKey OAuth id
   * @param oAuthType OAuth 종류
   * @param nickname 닉네임
   * @returns 로그인과 관련된 정보
   */
  async login(oAuthKey: number, oAuthType: TOAuthType, nickname: string) {
    let userInfo = await this.getUserInfo(oAuthKey, oAuthType);

    if (!checkExistUser(userInfo)) {
      userInfo = await this.join(oAuthKey, oAuthType, nickname);
    }

    const tokens = this.authService.generateToken(nickname, oAuthType);

    await this.authService.saveRefreshToken(String(userInfo.id), tokens.refreshToken);

    const loginInfo = { userInfo, ...tokens };

    return loginInfo;
  }
}
