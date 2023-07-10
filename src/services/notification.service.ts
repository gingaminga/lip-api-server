import User from "@/databases/rdb/entities/user.entity";
import { FcmTokenRepository } from "@/databases/rdb/repositories/fcm-token.repository";
import { Service } from "typedi";

@Service()
export default class NotificationService {
  private fcmTokenRepository = FcmTokenRepository;

  /**
   * @description FCM 토큰 설정하기
   * @param token 디바이스 토큰
   * @param userInfo 유저 정보
   * @returns true/false
   */
  async setFCMToken(token: string, userInfo: User) {
    const tokenInfo = await this.fcmTokenRepository.findToken(token, userInfo.id);

    if (!tokenInfo) {
      // 최초 등록
      const isSuccess = await this.fcmTokenRepository.saveToken(token, userInfo);

      return isSuccess;
    }

    // counting
    const isSuccess = await this.fcmTokenRepository.modifyCountUsingToken(token, tokenInfo.count + 1, userInfo.id);

    return isSuccess;
  }
}
