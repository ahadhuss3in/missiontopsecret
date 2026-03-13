import { prisma } from "../config/prisma";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { generateVerificationCode, sendVerificationCode } from "../utils/email";

function msToSeconds(ms: number): number {
  return Math.floor(ms / 1000);
}

function parseExpiration(timeStr: string): number {
  const match = timeStr.match(/^(\d+)([ms])$/);
  if (!match) return 15 * 60 * 1000; // default 15 minutes

  const value = parseInt(match[1], 10);
  const unit = match[2];
  return unit === "m" ? value * 60 * 1000 : value * 1000;
}

/**
 * Send verification code to email
 */
export async function sendEmailCode(email: string): Promise<{ success: boolean; message: string }> {
  // Clean up expired codes for this email
  await prisma.emailCode.deleteMany({
    where: {
      email,
      expiresAt: { lt: new Date() },
    },
  });

  // Check if a recent code was already sent (prevent spam)
  const recentCode = await prisma.emailCode.findFirst({
    where: {
      email,
      verifiedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (recentCode && new Date().getTime() - recentCode.createdAt.getTime() < 30000) {
    // Less than 30 seconds since last code
    return { success: false, message: "Please wait before requesting another code" };
  }

  const code = generateVerificationCode();
  const expiresIn = parseExpiration(env.EMAIL_CODE_EXPIRES_IN);
  const expiresAt = new Date(Date.now() + expiresIn);

  await prisma.emailCode.create({
    data: {
      email,
      code,
      expiresAt,
    },
  });

  try {
    await sendVerificationCode(email, code);
    return { success: true, message: "Verification code sent to your email" };
  } catch (error) {
    // Clean up the code if email sending failed
    await prisma.emailCode.deleteMany({
      where: { email, code },
    });
    throw error;
  }
}

/**
 * Verify email code and create/return user
 */
export async function verifyEmailCode(email: string, code: string): Promise<{ user: any; accessToken: string; refreshToken: string }> {
  const emailCode = await prisma.emailCode.findUnique({
    where: {
      email_code: { email, code },
    },
  });

  if (!emailCode) {
    throw new Error("Invalid verification code");
  }

  if (emailCode.expiresAt < new Date()) {
    throw new Error("Verification code expired");
  }

  if (emailCode.verifiedAt) {
    throw new Error("Verification code already used");
  }

  if (emailCode.attempts >= 5) {
    throw new Error("Too many failed attempts");
  }

  // Mark code as verified
  await prisma.emailCode.update({
    where: { id: emailCode.id },
    data: { verifiedAt: new Date() },
  });

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, displayName: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        passwordHash: "", // No password for email code login
        displayName: email.split("@")[0], // Default display name
      },
      select: { id: true, email: true, displayName: true },
    });
  }

  // Generate tokens
  const accessToken = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });

  const refreshTokenExpiresIn = parseExpiration(env.JWT_REFRESH_EXPIRES_IN);
  const refreshPayload = jwt.sign(
    { userId: user.id, type: "refresh" },
    env.JWT_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
  );

  // Store refresh token hash
  const crypto = require("crypto");
  const tokenHash = crypto.createHash("sha256").update(refreshPayload).digest("hex");

  const expiresAt = new Date(Date.now() + refreshTokenExpiresIn);
  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  // Clean up old email codes
  await prisma.emailCode.deleteMany({
    where: {
      email,
      expiresAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // older than 24 hours
    },
  });

  return {
    user,
    accessToken,
    refreshToken: refreshPayload,
  };
}

/**
 * Increment failed attempts
 */
export async function recordFailedAttempt(email: string, code: string): Promise<void> {
  const emailCode = await prisma.emailCode.findUnique({
    where: {
      email_code: { email, code },
    },
  });

  if (emailCode && emailCode.attempts < 5) {
    await prisma.emailCode.update({
      where: { id: emailCode.id },
      data: { attempts: { increment: 1 } },
    });
  }
}
