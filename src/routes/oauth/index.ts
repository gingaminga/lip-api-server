import { getOAuthURLController } from "@/controllers/auth/oauth.controller";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.get("/url", getOAuthURLController);

export default router;
