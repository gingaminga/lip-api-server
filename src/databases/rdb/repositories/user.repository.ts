import User from "@/databases/rdb/entities/user.entity";
import BaseRepository from "@/databases/rdb/repositories/base.repository";
import { TOAuthType } from "@/types/oauth";
import { Service } from "typedi";

@Service()
export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super();
    this.setTarget(User);
  }

  get queryBuilder() {
    return this.getQueryBuilder("user");
  }

  /**
   * @description 닉네임으로 유저 찾기
   * @param nickname 닉네임
   * @returns User | null
   */
  async findUserByNickname(nickname: string) {
    const userInfo = await this.getRepository().findOne({
      where: {
        nickname,
      },
    });

    return userInfo;
  }

  /**
   * @description OAuth 정보로 유저 찾기
   * @param oAuthKey OAuth id
   * @param oAuthType OAuth 종류
   * @returns User | null
   */
  async findUserByOAuth(oAuthKey: number, oAuthType: TOAuthType) {
    const userInfo = await this.getRepository().findOne({
      where: {
        oauthKey: oAuthKey,
        oauthType: oAuthType,
      },
    });

    return userInfo;
  }

  /**
   * @description 유저 추가하기
   * @param oAuthKey OAuth id
   * @param oAuthType OAuth 종류
   * @param nickname 닉네임
   * @returns User
   */
  async saveUser(oAuthKey: number, oAuthType: TOAuthType, nickname: string) {
    const user = new User();
    user.oauthKey = oAuthKey;
    user.oauthType = oAuthType;
    user.nickname = nickname;

    const userInfo = await this.getRepository().save(user);

    return userInfo;
  }
}
