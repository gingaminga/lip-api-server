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
   * @description 유저 찾기
   * @param nickname 닉네임
   * @param socialType 소셜 종류
   * @returns User | null
   */
  async findUser(nickname: string, socialType?: TSocialType) {
    const userInfo = await this.getRepository().findOne({
      where: {
        nickname,
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
   * @param email 이메일
   * @returns User
   */
  async saveUser(socialKey: string, socialType: TSocialType, nickname: string, email?: string) {
    const user = new User();
    user.socialKey = socialKey;
    user.socialType = socialType;
    user.nickname = nickname;
    user.email = email || null;

    const userInfo = await this.getRepository().save(user);

    return userInfo;
  }
}
