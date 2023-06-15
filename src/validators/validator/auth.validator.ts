import { GetSocialURLRequestParamDTO, ReissueTokenRequestParamDTO } from "@/dto/auth.dto";
import { RequestDTOHandler } from "@/types/express.custom";
import { getSocialURLSchema, reissueTokenSchema } from "@/validators/schema/auth.schema";

export const getSocialURLValidator: RequestDTOHandler<GetSocialURLRequestParamDTO> = async (req, res, next) => {
  const { type } = await getSocialURLSchema.validateAsync(req.query);

  res.locals.requestDTO = new GetSocialURLRequestParamDTO(type);

  next();
};

export const reissueTokenValidator: RequestDTOHandler<ReissueTokenRequestParamDTO> = async (req, res, next) => {
  const { refreshToken } = await reissueTokenSchema.validateAsync(req.body);

  res.locals.requestDTO = new ReissueTokenRequestParamDTO(refreshToken);

  next();
};
