import { GetOAuthURLRequestParamDTO, ReissueTokenRequestParamDTO } from "@/dto/auth.dto";
import { RequestDTOHandler } from "@/types/express.custom";
import { getOAuthURLSchema, reissueTokenSchema } from "@/validators/schema/auth.schema";

export const getOAuthURLValidator: RequestDTOHandler<GetOAuthURLRequestParamDTO> = async (req, res, next) => {
  const { type } = await getOAuthURLSchema.validateAsync(req.query);

  res.locals.dto = new GetOAuthURLRequestParamDTO(type);

  next();
};

export const reissueTokenValidator: RequestDTOHandler<ReissueTokenRequestParamDTO> = async (req, res, next) => {
  const { refreshToken } = await reissueTokenSchema.validateAsync(req.body);

  res.locals.dto = new ReissueTokenRequestParamDTO(refreshToken);

  next();
};
