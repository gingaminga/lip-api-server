import oauthRoute from "@/routes/oauth";
import { Router } from "express";

const router = Router();

router.use("/oauth", oauthRoute);

export default router;
