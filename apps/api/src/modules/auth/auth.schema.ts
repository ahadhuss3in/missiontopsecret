import { z } from "zod";

// Get current user - no input needed, uses Bearer token
export const getCurrentUserSchema = z.object({});

// Sync user profile (called after Clerk sign in on frontend)
export const syncUserSchema = z.object({
  email: z.string().email("Valid email is required"),
  displayName: z.string().min(1).max(60).optional(),
});

// Update user profile
export const updateUserSchema = z.object({
  displayName: z.string().min(1).max(60).optional(),
});

