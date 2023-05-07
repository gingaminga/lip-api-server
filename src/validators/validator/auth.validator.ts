import { ReissueTokenRequestParamDTO } from "@/dto/auth.dto";
import { RequestDTOHandler } from "@/types/express.custom";
import { reissueTokenSchema } from "@/validators/schema/auth.schema";

export const reissueTokenValidator: RequestDTOHandler<ReissueTokenRequestParamDTO> = async (req, res, next) => {
  const { refreshToken } = await reissueTokenSchema.validateAsync(req.body);

  res.locals.dto = new ReissueTokenRequestParamDTO(refreshToken);

  next();
};
