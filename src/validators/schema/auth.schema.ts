import { GetSocialURLRequestParamDTO, ReissueTokenRequestParamDTO } from "@/dto/auth.dto";
import constants from "@/utils/constants";
import joi from "joi";

export const getSocialURLSchema = joi.object<GetSocialURLRequestParamDTO>().keys({
  type: joi
    .string()
    .valid(constants.SOCIAL.KAKAO.NAME, constants.SOCIAL.NAVER.NAME, constants.SOCIAL.GOOGLE.NAME)
    .required(),
});

export const reissueTokenSchema = joi.object<ReissueTokenRequestParamDTO>().keys({
  refreshToken: joi.string().required(),
});
