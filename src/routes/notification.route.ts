import { setFCMTokenController } from "@/controllers/notification.controller";
import { checkExpireAccessToken } from "@/middlewares/check-expire-token";
import { setFCMTokenValidator } from "@/validators/validator/notification.validator";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.post("/fcm/token", checkExpireAccessToken, setFCMTokenValidator, setFCMTokenController);

export default router;
