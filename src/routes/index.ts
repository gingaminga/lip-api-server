import authRoute from "@/routes/auth.route";
import notificationRoute from "@/routes/notification.route";
import routineRoute from "@/routes/routine.route";
import todoRoute from "@/routes/todo.route";
import userRoute from "@/routes/user.route";
import { Router } from "express";

const router = Router();

router.use("/auth", authRoute);
router.use("/notification", notificationRoute);
router.use("/routine", routineRoute);
router.use("/todo", todoRoute);
router.use("/user", userRoute);

export default router;
