import {
  changeNicknameController,
  duplicateNicknameController,
  loginController,
  logoutController,
  withdrawalController,
} from "@/controllers/user.controller";
import { checkExpireAccessToken } from "@/middlewares/check-expire-token";
import {
  changeNicknameValidator,
  duplicateNicknameValidator,
  loginValidator,
} from "@/validators/validator/user.validator";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.post("/in", loginValidator, loginController);
router.post("/out", checkExpireAccessToken, logoutController);
router.post("/nickname", checkExpireAccessToken, changeNicknameValidator, changeNicknameController);
router.get("/nickname/dup", checkExpireAccessToken, duplicateNicknameValidator, duplicateNicknameController);
router.delete("/", checkExpireAccessToken, withdrawalController);

export default router;
