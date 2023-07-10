import { dataSource } from "@/databases/rdb/client";
import FcmToken from "@/databases/rdb/entities/fcm-token.entity";
import User from "../entities/user.entity";

export const FcmTokenRepository = dataSource.getRepository(FcmToken).extend({
  /**
   * @description 디바이스 토큰 찾기
   * @param token 디바이스 토큰
   * @param userID 유저 id
   * @returns FcmToken
   */
  async findToken(token: string, userID: number) {
    const isExist = await this.findOne({
      where: {
        deviceToken: token,
        user: {
          id: userID,
        },
      },
    });

    return isExist;
  },
  /**
   * @description 사용횟수 수정하기
   * @param token 디바이스 토큰
   * @param newCount 카운팅
   * @param userID 유저 id
   * @returns true/false
   */
  async modifyCountUsingToken(token: string, newCount: number, userID: number) {
    const result = await this.update(
      {
        deviceToken: token,
        user: {
          id: userID,
        },
      },
      {
        count: newCount,
      },
    );

    if (result.affected && result.affected > 0) {
      return true;
    }

    return false;
  },
  /**
   * @description 디바이스 토큰 저장하기
   * @param token 디바이스 토큰
   * @param user 유저
   * @returns FcmToken
   */
  async saveToken(token: string, user: User) {
    const fcmToken = new FcmToken();
    fcmToken.deviceToken = token;
    fcmToken.user = user;

    const fcmTokenInfo = await this.save(fcmToken);

    return fcmTokenInfo;
  },
});
