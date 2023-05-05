import { getOAuthURLController } from "@/controllers/oauth.controller";
import { getOAuthURLValidator } from "@/validators/validator/oauth.validator";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.get("/url", getOAuthURLValidator, getOAuthURLController);

export default router;
