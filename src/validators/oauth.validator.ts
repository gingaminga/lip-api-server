import { GetOAuthURLRequestParamDTO, OAuthLoginRequestParamDTO } from "@/dto/oauth.dto";
import { RequestDTOHandler } from "@/types/express.custom";
import { getOAuthURLSchema, oAuthLoginSchema } from "@/validators/oauth.schema";

export const getOAuthURLValidator: RequestDTOHandler<GetOAuthURLRequestParamDTO> = async (req, res, next) => {
  const { type } = await getOAuthURLSchema.validateAsync(req.query);

  res.locals.dto = new GetOAuthURLRequestParamDTO(type);

  next();
};

export const oAuthLoginValidator: RequestDTOHandler<OAuthLoginRequestParamDTO> = async (req, res, next) => {
  const { code, type } = await oAuthLoginSchema.validateAsync(req.body);

  res.locals.dto = new OAuthLoginRequestParamDTO(type, code);

  next();
};
