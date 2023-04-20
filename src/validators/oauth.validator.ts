import { GetOAuthURLRequestParamDTO } from "@/dto/oauth.dto";
import { RequestDTOHandler } from "@/types/express.custom";
import { getOAuthURLSchema } from "@/validators/oauth.schema";

export const getOAuthURLValidator: RequestDTOHandler<GetOAuthURLRequestParamDTO> = async (req, res, next) => {
  const { type } = await getOAuthURLSchema.validateAsync(req.query);

  res.locals.dto = new GetOAuthURLRequestParamDTO(type);

  next();
};
