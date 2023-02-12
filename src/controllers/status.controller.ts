import { statusService } from "@loaders/container.loader";
import { RESPONSE_MESSAGE } from "@utils/response";
import { RequestHandler } from "express";

export const checkStatusController: RequestHandler = (req, res) => {
  const isHtml = Boolean(req.query.html);

  const isGood = statusService.getServerStatus();

  const data = isGood ? RESPONSE_MESSAGE.GOOD : RESPONSE_MESSAGE.BAD;

  if (isHtml) {
    res.send(data);

    return;
  }

  res.result(data);
};