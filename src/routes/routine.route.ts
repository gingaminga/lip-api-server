import { getAllRoutineController, getRoutineController } from "@/controllers/routine.controller";
import { checkExpireAccessToken } from "@/middlewares/check-expire-token";
import { getAllRoutineValidator, getRoutineValidator } from "@/validators/validator/routine.validator";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.get("/all", checkExpireAccessToken, getAllRoutineValidator, getAllRoutineController);
router.get("/", checkExpireAccessToken, getRoutineValidator, getRoutineController);

export default router;
