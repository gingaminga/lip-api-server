import { getOAuthURLController } from "@/controllers/auth/oauth.controller";
import { getOAuthURLValidator } from "@/validators/oauth.validator";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.get("/url", getOAuthURLValidator, getOAuthURLController);

export default router;
