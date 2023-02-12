import CError, { ERROR_MESSAGE } from "@utils/error";
import HTTP_STATUS_CODE from "@utils/http-status-code";
import { isCelebrateError } from "celebrate";
import { NextFunction, Request, Response } from "express";

/**
 * @description celebrate error handler 미들웨어
 */
export default (error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (isCelebrateError(error)) {
    const customError = new CError(ERROR_MESSAGE.INVALID_VALUE, HTTP_STATUS_CODE.INVALID_VALUE);
    res.error(customError);
  }
};