import { loginController, logoutController } from "@/controllers/user.controller";
import { checkExpireAccessToken } from "@/middlewares/check-expire-token";
import { loginValidator } from "@/validators/validator/user.validator";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.post("/in", loginValidator, loginController);
router.post("/out", checkExpireAccessToken, logoutController);

export default router;
