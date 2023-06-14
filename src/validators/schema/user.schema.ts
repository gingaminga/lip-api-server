import { TSocialType } from "@/types/social";
import constants from "@/utils/constants";
import joi from "joi";

interface ILoginSchema {
  code: string;
  type: TSocialType;
}

export const loginSchema = joi.object<ILoginSchema>().keys({
  code: joi.string().required(),
  type: joi
    .string()
    .valid(constants.SOCIAL.KAKAO.NAME, constants.SOCIAL.NAVER.NAME, constants.SOCIAL.GOOGLE.NAME)
    .required(),
});
