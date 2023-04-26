import { RESPONSE_STATUS } from "@/utils/response";

/**
 * @description 무작위 텍스트 만들기
 * @param length 만들고자하는 길이
 * @returns 무작위 문자열
 */
export const getRandomText = (length = 15) => {
  const CHARACTER = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  const test = CHARACTER.length;

  let randomstring = "";
  for (let i = 0; i < length; i++) {
    const rnum = Math.floor(Math.random() * test);
    randomstring += CHARACTER.substring(rnum, rnum + 1);
  }

  return randomstring;
};

/**
 * @description 응답 포맷
 * @param status 성공 실패 여부
 * @param data 전달할 데이터
 * @returns 전달할 JSON 객체
 */
export const getResponseFormat = (status: boolean, data: any) => ({
  data,
  status: status ? RESPONSE_STATUS.SUCCESS : RESPONSE_STATUS.FAILURE,
});

/**
 * @description JSON parsing하기
 * @param value JSON.stringify가 적용된 문자열
 */
export const parseJSON = <T>(value: string) => {
  try {
    const realValue: T = JSON.parse(value);

    return realValue;
  } catch (error) {
    /* empty */
  }

  return null;
};
