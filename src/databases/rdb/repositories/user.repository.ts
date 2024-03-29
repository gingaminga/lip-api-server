import { dataSource } from "@/databases/rdb/client";
import User from "@/databases/rdb/entities/user.entity";
import { TSocialType } from "@/types/social";

export const UserRepository = dataSource.getRepository(User).extend({
  /**
   * @description 닉네임 변경하기
   * @param nickname 닉네임
   * @param userID 유저 id
   * @returns true (수정) / false (수정 실패)
   */
  async changeNickname(nickname: string, userID: number) {
    const result = await this.update(
      {
        id: userID,
      },
      {
        nickname,
      },
    );

    if (result.affected && result.affected > 0) {
      return true;
    }

    return false;
  },
  /**
   * @description 소셜 정보로 유저 찾기
   * @param socialType 소셜 종류
   * @param socialKey 소셜 id
   * @returns User | null
   */
  async findUserBySocial(socialType?: TSocialType, socialKey?: string) {
    const userInfo = await this.findOne({
      where: {
        socialType,
        socialKey,
      },
    });

    return userInfo;
  },
  /**
   * @description 유저 삭제하기
   * @param userID 소셜 id
   * @returns true (수정) / false (수정 실패)
   */
  async removeUser(userID: number) {
    const result = await this.delete({
      id: userID,
    });

    if (result.affected && result.affected > 0) {
      return true;
    }

    return false;
  },
  /**
   * @description 닉네임으로 유저 찾기
   * @param nickname 닉네임
   * @returns User | null
   */
  async findUserByNickname(nickname: string) {
    const userInfo = await this.findOne({
      where: {
        nickname,
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
    user.email = email || null;
    user.nickname = nickname;
    user.socialKey = socialKey;
    user.socialType = socialType;

    const userInfo = await this.save(user);

    return userInfo;
  },
});
