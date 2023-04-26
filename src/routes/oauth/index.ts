import { getOAuthURLController, oAuthURLController } from "@/controllers/auth/oauth.controller";
import { getOAuthURLValidator, oAuthLoginValidator } from "@/validators/oauth.validator";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.get("/url", getOAuthURLValidator, getOAuthURLController);

router.post("/", oAuthLoginValidator, oAuthURLController);

export default router;
