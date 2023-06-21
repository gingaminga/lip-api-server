import { dataSource } from "@/databases/rdb/client";
import Alarm from "@/databases/rdb/entities/alarm.entity";

export const AlarmRepository = dataSource.getRepository(Alarm).extend({
  /**
   * @description 알람 추가하기
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
  /**
   * @description 알람 수정하기
   * @param id 알람 id
   * @param hour 시
   * @param minute 분
   * @returns true (수정) / false (수정 실패)
   */
  async modifyAlarm(id: number, hour: number, minute: number) {
    const result = await this.update(
      {
        id,
      },
      {
        hour,
        minute,
      },
    );

    if (result.affected && result.affected > 0) {
      return true;
    }

    return false;
  },
  /**
   * @description 알람 삭제하기
   * @param alarmID 알람 id
   * @returns true (삭제) / false (삭제 실패)
   */
  async removeAlarm(alarmID: number) {
    const result = await this.delete({
      id: alarmID,
    });

    if (result.affected && result.affected > 0) {
      return true;
    }

    return false;
  },
});
