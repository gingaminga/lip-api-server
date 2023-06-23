import { DuplicateNicknameRequestParamDTO, LoginRequestParamDTO } from "@/dto/user.dto";
import constants from "@/utils/constants";
import joi from "joi";

export const duplicateNicknameSchema = joi.object<DuplicateNicknameRequestParamDTO>().keys({
  nickname: joi.string().required(),
});

export const loginSchema = joi.object<LoginRequestParamDTO>().keys({
  code: joi.string().required(),
  type: joi
    .string()
    .valid(constants.SOCIAL.KAKAO.NAME, constants.SOCIAL.NAVER.NAME, constants.SOCIAL.GOOGLE.NAME)
    .required(),
});
