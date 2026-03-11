import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { register, login, refresh, logout, me } from "./auth.controller";
import { registerSchema, loginSchema } from "./auth.schema";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, me);
