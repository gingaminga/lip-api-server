import { dataSource } from "@/databases/rdb/client";
import Alarm from "@/databases/rdb/entities/alarm.entity";

const alias = "alarm";

export const AlarmRepository = dataSource.getRepository(Alarm).extend({
  /**
   * @description 알람 등록하기
   * @param hour 시
   * @param minute 분
   * @returns Alarm
   */
  async addAlarm(hour: number, minute: number) {
    const alarm = new Alarm();
    alarm.hour = hour;
    alarm.minute = minute;

    const alarmInfo = await this.save(alarm);

    return alarmInfo;
  },
});
