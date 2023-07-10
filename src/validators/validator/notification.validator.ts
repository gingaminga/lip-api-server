import { SetFCMTokenRequestParamDTO } from "@/dto/notification.dto";
import { RequestDTOHandler } from "@/types/express.custom";
import { setFCMTokenSchema } from "@/validators/schema/notification.schema";

export const setFCMTokenValidator: RequestDTOHandler<SetFCMTokenRequestParamDTO> = async (req, res, next) => {
  const { token } = await setFCMTokenSchema.validateAsync(req.body);

  res.locals.requestDTO = new SetFCMTokenRequestParamDTO(token);

  next();
};
