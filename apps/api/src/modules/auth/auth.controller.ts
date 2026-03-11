import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { registerUser, loginUser, refreshAccessToken, revokeRefreshToken } from "./auth.service";
import { prisma } from "../../config/prisma";

const COOKIE_NAME = "refreshToken";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/api/v1/auth/refresh",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, displayName } = req.body;
  const { user, accessToken, rawRefresh } = await registerUser(email, password, displayName);
  res.cookie(COOKIE_NAME, rawRefresh, COOKIE_OPTIONS);
  res.status(201).json({ data: { user, accessToken } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, accessToken, rawRefresh } = await loginUser(email, password);
  res.cookie(COOKIE_NAME, rawRefresh, COOKIE_OPTIONS);
  res.status(200).json({ data: { user, accessToken } });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const rawRefresh = req.cookies[COOKIE_NAME];
  if (!rawRefresh) {
    res.status(401).json({ error: { code: "MISSING_REFRESH_TOKEN", message: "No refresh token" } });
    return;
  }
  const accessToken = await refreshAccessToken(rawRefresh);
  res.status(200).json({ data: { accessToken } });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const rawRefresh = req.cookies[COOKIE_NAME];
  if (rawRefresh) await revokeRefreshToken(rawRefresh);
  res.clearCookie(COOKIE_NAME, { path: "/api/v1/auth/refresh" });
  res.status(204).send();
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, displayName: true, createdAt: true },
  });
  res.status(200).json({ data: user });
});
