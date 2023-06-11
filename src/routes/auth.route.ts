import { getOAuthURLController, reissueTokenController } from "@/controllers/auth.controller";
import { checkExpireRefreshToken } from "@/middlewares/check-expire-token";
import { getOAuthURLValidator, reissueTokenValidator } from "@/validators/validator/auth.validator";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.get("/url", getOAuthURLValidator, getOAuthURLController);
router.post("/token", reissueTokenValidator, checkExpireRefreshToken, reissueTokenController);

export default router;
