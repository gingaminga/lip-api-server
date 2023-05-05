import { LoginRequestParamDTO } from "@/dto/user.dto";
import { RequestDTOHandler } from "@/types/express.custom";
import { loginSchema } from "@/validators/schema/user.schema";

export const loginValidator: RequestDTOHandler<LoginRequestParamDTO> = async (req, res, next) => {
  const { code, type } = await loginSchema.validateAsync(req.body);

  res.locals.dto = new LoginRequestParamDTO(type, code);

  next();
};
