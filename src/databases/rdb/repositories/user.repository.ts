import User from "@/databases/rdb/entities/user.entity";
import BaseRepository from "@/databases/rdb/repositories/base.repository";
import { TSocialType } from "@/types/social";
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
   * @description 소셜 정보로 유저 찾기
   * @param socialKey 소셜 id
   * @param socialType 소셜 종류
   * @returns User | null
   */
  async findUserBySocial(socialKey: number, socialType: TSocialType) {
    const userInfo = await this.getRepository().findOne({
      where: {
        socialKey,
        socialType,
      },
    });

    return userInfo;
  }

  /**
   * @description 유저 추가하기
   * @param socialKey 소셜 id
   * @param socialType 소셜 종류
   * @param nickname 닉네임
   * @returns User
   */
  async saveUser(socialKey: number, socialType: TSocialType, nickname: string) {
    const user = new User();
    user.socialKey = socialKey;
    user.socialType = socialType;
    user.nickname = nickname;

    const userInfo = await this.getRepository().save(user);

    return userInfo;
  }
}
