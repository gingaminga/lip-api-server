import { getTodoController } from "@/controllers/todo.controller";
import { checkExpireAccessToken } from "@/middlewares/check-expire-token";
import { getToDoValidator } from "@/validators/validator/todo.validator";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.get("/", checkExpireAccessToken, getToDoValidator, getTodoController);

export default router;
