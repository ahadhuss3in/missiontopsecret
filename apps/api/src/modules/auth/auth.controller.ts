import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { syncUserProfile, getCurrentUser } from "./auth.service";

/**
 * Sync user profile with Clerk data
 * Called after user authenticates with Clerk on frontend
 */
export const sync = asyncHandler(async (req: Request, res: Response) => {
  const user = await syncUserProfile(req.body, req.clerkId!);
  res.status(200).json({ data: { user } });
});

/**
 * Get current authenticated user
 * Requires valid Bearer token from Clerk
 */
export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await getCurrentUser(req.userId!);
  res.status(200).json({ data: user });
});

