import User from "@/databases/rdb/entities/user.entity";
import { AlarmRepository } from "@/databases/rdb/repositories/alarm.repository";
import { FcmTokenRepository } from "@/databases/rdb/repositories/fcm-token.repository";
import { RoutineRepository } from "@/databases/rdb/repositories/routine.repository";
import { TodoRepository } from "@/databases/rdb/repositories/todo.repository";
import { IFirebaseRequireItem } from "@/types/notification";
import { getDayInfo, getTime, getYYYYMMDD } from "@/utils/date";
import { sendMessageFromFirebase } from "@/utils/lib/firebase";
import schedule from "node-schedule";
import { Service } from "typedi";

@Service()
export default class NotificationService {
  private alarmRepository = AlarmRepository;

  private fcmTokenRepository = FcmTokenRepository;

  private todoRepository = TodoRepository;

  private routineRepository = RoutineRepository;

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

  /**
   * @description FCM으로 전달할 메시지 가져오기
   * @param content 내용
   * @param tokens device token 여러개
   * @returns
   */
  static getFCMMessage(content: string, tokens: string[]) {
    const message = {
      notification: {
        title: content,
        body: "오늘 하루도 화이팅! :)",
      },
      tokens,
    };

    return message;
  }

  /**
   * @description 알림 보내기
   * @param date YYYYMMDD 형식의 날짜
   * @param hour 시
   * @param minute 분
   */
  async sendNotification(date: string, hour: number, minute: number) {
    const alarm = await this.findAlarm(hour, minute);

    if (!alarm) {
      return;
    }

    const notificationToDos = await this.getNotificationToDoMap(date, alarm.id);

    await Promise.all(
      notificationToDos.map(async (notification) => {
        const { content, tokens } = notification;
        const message = NotificationService.getFCMMessage(content, tokens);

        await sendMessageFromFirebase(message);
      }),
    );

    const notificationRoutines = await this.getNotificationRoutineMap(date, alarm.id);

    await Promise.all(
      notificationRoutines.map(async (notification) => {
        const { content, tokens } = notification;
        const message = NotificationService.getFCMMessage(content, tokens);

        await sendMessageFromFirebase(message);
      }),
    );
  }

  /**
   * @description 알림 정보 가져오기
   * @param hour 시
   * @param minute 분
   * @returns Alarm
   */
  async findAlarm(hour: number, minute: number) {
    const alarm = await this.alarmRepository.findAlarm(hour, minute);

    return alarm;
  }

  /**
   * @description Map형식의 할 일별 알림 정보 가져오기
   * @param date YYYYMMDD 형식의 날짜
   * @param alarmID 알람 id
   * @returns todo_id : IFirebaseRequireItem 형식의 Map
   */
  async getNotificationToDoMap(date: string, alarmID: number) {
    const notificationToDos = await this.todoRepository.findContentAndDeviceToKen(date, alarmID);

    const notificationItemByID = new Map<number, IFirebaseRequireItem>();

    notificationToDos.forEach((todo) => {
      const { content, device_token: deviceToken, id } = todo;

      if (!notificationItemByID.has(id)) {
        const item = {
          content,
          tokens: [deviceToken],
        };

        notificationItemByID.set(id, item);

        return;
      }

      const item = notificationItemByID.get(id);
      item?.tokens.push(deviceToken);
    });

    const notifications = [...notificationItemByID.values()];

    return notifications;
  }

  /**
   * @description Map형식의 루틴별 알림 정보 가져오기
   * @param date YYYYMMDD 형식의 날짜
   * @param alarmID 알람 id
   * @returns routine_id : IFirebaseRequireItem 형식의 Map
   */
  async getNotificationRoutineMap(date: string, alarmID: number) {
    const { textOfDay } = getDayInfo(date);
    const notificationRoutines = await this.routineRepository.findContentAndDeviceToKen(textOfDay, alarmID);

    const notificationItemByID = new Map<number, IFirebaseRequireItem>();

    notificationRoutines.forEach((routine) => {
      const { content, device_token: deviceToken, id } = routine;

      if (!notificationItemByID.has(id)) {
        const item = {
          content,
          tokens: [deviceToken],
        };

        notificationItemByID.set(id, item);

        return;
      }

      const item = notificationItemByID.get(id);
      item?.tokens.push(deviceToken);
    });

    const notifications = [...notificationItemByID.values()];

    return notifications;
  }

  /**
   * @description 정규 스케쥴
   */
  regularlySchedule() {
    const rule = new schedule.RecurrenceRule();
    rule.second = 0;

    schedule.scheduleJob(rule, async () => {
      const yyyymmdd = getYYYYMMDD("");
      const { hour, minute } = getTime();

      await this.sendNotification(yyyymmdd, hour, minute);
    });
  }
}
