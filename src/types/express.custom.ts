import User from "@/databases/rdb/entities/user.entity";
import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * @description RequestHandler + DTO 커스텀
 */
export type RequestDTOHandler<T = unknown> = (
  req: Request,
  res: Response & {
    locals: Response["locals"] & {
      requestDTO: T;
      userInfo: User;
    };
  },
  next: NextFunction,
) => ReturnType<RequestHandler>;

/**
 * @description Response + DTO 커스텀
 */
export type ResponseDTO<T> = Response<any, Record<string, any>> & {
  locals: Record<string, any> & { dto: T };
};
