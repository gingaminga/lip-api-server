import { RequestHandler, Router } from "express";

const router = Router();

const checkStatus: RequestHandler = (req, res, next) => {
  res.send("OK");
};

router.get("/status", checkStatus);

export default router;
