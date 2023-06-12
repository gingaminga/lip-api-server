import { ReissueTokenDTO } from "@/dto/auth.dto";
import { authService } from "@/loaders/service.loader";
import AuthService from "@/services/auth.service";
import { RequestDTOHandler } from "@/types/express.custom";
import CError, { ERROR_MESSAGE } from "@/utils/error";
import HTTP_STATUS_CODE from "@/utils/http-status-code";
import { NextFunction, Request, Response } from "express";

export const checkExpireAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization = "" } = req.headers;

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer") {
      throw new CError(ERROR_MESSAGE.UNAUTHORIZED, HTTP_STATUS_CODE.UNAUTHORIZED);
    }

    AuthService.validateAccessToken(token);

    next();
  } catch (error) {
    throw new CError(`${ERROR_MESSAGE.UNAUTHORIZED} ACCESS TOKEN`, HTTP_STATUS_CODE.UNAUTHORIZED);
  }
};

export const checkExpireRefreshToken: RequestDTOHandler<ReissueTokenDTO> = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = res.locals.dto;

    const payload = await authService.validateRefreshToken(refreshToken);

    res.locals.dto = new ReissueTokenDTO(refreshToken, payload.nickname, payload.type);

    next();
  } catch (error) {
    throw new CError(`${ERROR_MESSAGE.UNAUTHORIZED} REFRESH TOKEN`, HTTP_STATUS_CODE.UNAUTHORIZED);
  }
};