import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { sync, me } from "./auth.controller";
import { syncUserSchema } from "./auth.schema";

export const authRouter = Router();

/**
 * Sync user profile after Clerk sign in on frontend
 * POST /api/v1/auth/sync
 * Body: { email: string, displayName?: string }
 * Auth: Clerk Bearer token (required)
 */
authRouter.post("/sync", requireAuth, validate(syncUserSchema), sync);

/**
 * Get current authenticated user
 * GET /api/v1/auth/me
 * Auth: Clerk Bearer token (required)
 */
authRouter.get("/me", requireAuth, me);
