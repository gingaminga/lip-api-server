import { dataSource } from "@/databases/rdb/client";
import User from "@/databases/rdb/entities/user.entity";
import { TSocialType } from "@/types/social";

export const UserRepository = dataSource.getRepository(User).extend({
  /**
   * @description 유저 찾기
   * @param nickname 닉네임
   * @param socialType 소셜 종류
   * @returns User | null
   */
  async findUser(nickname: string, socialType?: TSocialType) {
    const userInfo = await this.findOne({
      where: {
        nickname,
        socialType,
      },
    });

    return userInfo;
  },
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

    const userInfo = await this.save(user);

    return userInfo;
  },
});
