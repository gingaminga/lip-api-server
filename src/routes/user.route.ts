import { duplicateNicknameController, loginController, logoutController } from "@/controllers/user.controller";
import { checkExpireAccessToken } from "@/middlewares/check-expire-token";
import { duplicateNicknameValidator, loginValidator } from "@/validators/validator/user.validator";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.post("/in", loginValidator, loginController);
router.post("/out", checkExpireAccessToken, logoutController);
router.get("/nickname/dup", checkExpireAccessToken, duplicateNicknameValidator, duplicateNicknameController);

export default router;
