import { reissueTokenController } from "@/controllers/auth.controller";
import { checkExpireRefreshToken } from "@/middlewares/check-expire-token";
import { reissueTokenValidator } from "@/validators/validator/auth.validator";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.post("/token", reissueTokenValidator, checkExpireRefreshToken, reissueTokenController);

export default router;
