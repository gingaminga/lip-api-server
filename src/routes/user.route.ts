import { loginController } from "@/controllers/user.controller";
import { loginValidator } from "@/validators/validator/user.validator";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.post("/in", loginValidator, loginController);

export default router;
