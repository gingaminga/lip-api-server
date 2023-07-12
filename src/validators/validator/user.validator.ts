import {
  ChangeNicknameRequestParamDTO,
  DuplicateNicknameRequestParamDTO,
  LoginRequestParamDTO,
  LogoutRequestParamDTO,
} from "@/dto/user.dto";
import { RequestDTOHandler } from "@/types/express.custom";
import {
  changeNicknameSchema,
  duplicateNicknameSchema,
  loginSchema,
  logoutSchema,
} from "@/validators/schema/user.schema";

export const changeNicknameValidator: RequestDTOHandler<ChangeNicknameRequestParamDTO> = async (req, res, next) => {
  const { deviceToken, nickname } = await changeNicknameSchema.validateAsync(req.body);

  res.locals.requestDTO = new ChangeNicknameRequestParamDTO(nickname, deviceToken);

  next();
};

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

export const logoutValidator: RequestDTOHandler<LogoutRequestParamDTO> = async (req, res, next) => {
  const { deviceToken } = await logoutSchema.validateAsync(req.body);

  res.locals.requestDTO = new LogoutRequestParamDTO(deviceToken);

  next();
};
