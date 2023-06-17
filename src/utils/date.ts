import dayjs, { Dayjs } from "dayjs";

/**
 * @description 첫번째, 마지막번째 날짜 가져오기
 * @param date 원하는 날짜
 * @param pad 공백에 붙일 단어
 * @returns
 */
export const getFirstAndLastDay = (date: Dayjs | Date | string = new Date(), pad = "") => {
  const targetDate = dayjs(date);

  const first = `${pad}1`;
  const final = targetDate.daysInMonth();

  return {
    final,
    first,
  };
};
