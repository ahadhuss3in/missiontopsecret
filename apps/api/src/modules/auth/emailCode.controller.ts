import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendEmailCode, verifyEmailCode, recordFailedAttempt } from "./emailCode.service";

const COOKIE_NAME = "refreshToken";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/api/v1/auth/refresh",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

/**
 * Step 1: Request verification code to be sent to email
 */
export const requestCode = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    res.status(400).json({ error: { code: "INVALID_EMAIL", message: "Valid email is required" } });
    return;
  }

  const result = await sendEmailCode(email);
  res.status(200).json({ data: result });
});

/**
 * Step 2: Verify code and login/register user
 */
export const verifyCode = asyncHandler(async (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code || typeof email !== "string" || typeof code !== "string") {
    res.status(400).json({ error: { code: "INVALID_INPUT", message: "Email and code are required" } });
    return;
  }

  try {
    const { user, accessToken, refreshToken } = await verifyEmailCode(email, code);
    res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
    res.status(200).json({
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    // Record failed attempt
    await recordFailedAttempt(email, code);

    const message = error instanceof Error ? error.message : "Verification failed";
    const statusCode = message.includes("expired") ? 400 : message.includes("attempted") ? 429 : 401;

    res.status(statusCode).json({
      error: {
        code: "VERIFICATION_FAILED",
        message,
      },
    });
  }
});
