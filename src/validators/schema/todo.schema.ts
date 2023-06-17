import CError, { ERROR_MESSAGE } from "@/utils/error";
import HTTP_STATUS_CODE from "@/utils/http-status-code";
import dayjs from "dayjs";
import joi from "joi";

interface IGetToDoSchema {
  date: string;
}

export const getToDoSchema = joi.object<IGetToDoSchema>().keys({
  date: joi.string().custom((origin: string) => {
    const numberRegEXp = /^[0-9]+$/;
    if (!numberRegEXp.test(origin)) {
      throw new CError(ERROR_MESSAGE.INVALID_VALUE, HTTP_STATUS_CODE.INVALID_VALUE);
    }

    if (origin.length === 6) {
      // 월
      return dayjs(origin).format("YYYYMM");
    }

    if (origin.length === 8) {
      // 일
      return dayjs(origin).format("YYYYMMDD");
    }

    throw new CError(ERROR_MESSAGE.INVALID_VALUE, HTTP_STATUS_CODE.INVALID_VALUE);
  }),
});
