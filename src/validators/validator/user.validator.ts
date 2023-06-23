import { DuplicateNicknameRequestParamDTO, LoginRequestParamDTO } from "@/dto/user.dto";
import { RequestDTOHandler } from "@/types/express.custom";
import { duplicateNicknameSchema, loginSchema } from "@/validators/schema/user.schema";

export const duplicateNicknameValidator: RequestDTOHandler<DuplicateNicknameRequestParamDTO> = async (
  req,
  res,
  next,
) => {
  const { nickname } = await duplicateNicknameSchema.validateAsync(req.query);

  res.locals.requestDTO = new DuplicateNicknameRequestParamDTO(nickname);

  next();
};

export const loginValidator: RequestDTOHandler<LoginRequestParamDTO> = async (req, res, next) => {
  const { code, type } = await loginSchema.validateAsync(req.body);

  res.locals.requestDTO = new LoginRequestParamDTO(type, code);

  next();
};
