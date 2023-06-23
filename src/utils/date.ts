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

/**
 * @description 요일이 존재하는지 확인하기
 * @param days 요일
 * @returns 요일 존재 여부
 */
export const getExistDay = (days: string) => {
  const sunday = days.includes("0");
  const monday = days.includes("1");
  const tuesday = days.includes("2");
  const wednesday = days.includes("3");
  const thursday = days.includes("4");
  const friday = days.includes("5");
  const saturday = days.includes("6");

  return {
    friday,
    monday,
    saturday,
    sunday,
    thursday,
    tuesday,
    wednesday,
  };
};

/**
 * @description 날짜에 해당하는 요일 가져오기
 * @param date 날짜
 * @returns
 */
export const getDayfromDate = (date: string) => dayjs(date).get("day");
