import User from "@/databases/rdb/entities/user.entity";
import UserRepository from "@/databases/rdb/repositories/user.repository";
import { TOAuthType } from "@/types/oauth";
import { getRandomText } from "@/utils";
import { Inject, Service } from "typedi";

@Service()
export default class UserService {
  constructor(@Inject() private userRepository: UserRepository) {
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
   * @description 유저가 존재하는지 여부 확인하기
   * @param oAuthKey OAuth id
   * @param oAuthType OAuth 종류
   * @returns 존재 여부
   */
  static checkExistUser(userInfo: User | null) {
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

    return this.userRepository.saveUser(oAuthKey, oAuthType, finalNickname);
  }

  /**
   * @description 로그인하기
   * @param oAuthKey OAuth id
   * @param oAuthType OAuth 종류
   * @param nickname 닉네임
   * @returns
   */
  async login(oAuthKey: number, oAuthType: TOAuthType, nickname: string) {
    let userInfo = await this.getUserInfo(oAuthKey, oAuthType);
    const isExist = UserService.checkExistUser(userInfo);

    if (!isExist) {
      userInfo = await this.join(oAuthKey, oAuthType, nickname);
    }

    return {
      user_info: userInfo,
    };
  }
}
