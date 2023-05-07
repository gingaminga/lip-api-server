import joi from "joi";

interface IReissueToken {
  refreshToken: string;
}

export const reissueTokenSchema = joi.object<IReissueToken>().keys({
  refreshToken: joi.string().required(),
});
