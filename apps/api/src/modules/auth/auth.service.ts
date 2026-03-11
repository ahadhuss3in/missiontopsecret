import { prisma } from "../../config/prisma";
import { hashPassword, comparePassword, hashToken } from "../../utils/hash";
import { signAccessToken, signRefreshToken, verifyToken } from "../../utils/jwt";
import { env } from "../../config/env";

export async function registerUser(email: string, password: string, displayName?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw Object.assign(new Error("Email already registered"), { status: 409, code: "EMAIL_IN_USE" });

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, displayName },
    select: { id: true, email: true, displayName: true, createdAt: true },
  });

  const accessToken = signAccessToken(user.id, user.email);
  const rawRefresh = signRefreshToken(user.id);
  const tokenHash = await hashToken(rawRefresh);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await prisma.refreshToken.create({ data: { userId: user.id, tokenHash, expiresAt } });

  return { user, accessToken, rawRefresh };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw Object.assign(new Error("Invalid credentials"), { status: 401, code: "INVALID_CREDENTIALS" });

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw Object.assign(new Error("Invalid credentials"), { status: 401, code: "INVALID_CREDENTIALS" });

  const accessToken = signAccessToken(user.id, user.email);
  const rawRefresh = signRefreshToken(user.id);
  const tokenHash = await hashToken(rawRefresh);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await prisma.refreshToken.create({ data: { userId: user.id, tokenHash, expiresAt } });

  return {
    user: { id: user.id, email: user.email, displayName: user.displayName, createdAt: user.createdAt },
    accessToken,
    rawRefresh,
  };
}

export async function refreshAccessToken(rawRefreshToken: string) {
  let payload: { sub: string };
  try {
    payload = verifyToken(rawRefreshToken) as { sub: string };
  } catch {
    throw Object.assign(new Error("Invalid refresh token"), { status: 401, code: "INVALID_REFRESH_TOKEN" });
  }

  const tokens = await prisma.refreshToken.findMany({
    where: { userId: payload.sub, revokedAt: null, expiresAt: { gt: new Date() } },
  });

  const { compareToken } = await import("../../utils/hash");
  const matchingToken = await Promise.all(
    tokens.map(async (t) => ({ t, match: await compareToken(rawRefreshToken, t.tokenHash) }))
  ).then((results) => results.find((r) => r.match)?.t);

  if (!matchingToken) {
    throw Object.assign(new Error("Refresh token not found or revoked"), { status: 401, code: "INVALID_REFRESH_TOKEN" });
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, email: true } });
  if (!user) throw Object.assign(new Error("User not found"), { status: 401, code: "USER_NOT_FOUND" });

  return signAccessToken(user.id, user.email);
}

export async function revokeRefreshToken(rawRefreshToken: string) {
  let payload: { sub: string };
  try {
    payload = verifyToken(rawRefreshToken) as { sub: string };
  } catch {
    return; // already invalid, nothing to revoke
  }

  const tokens = await prisma.refreshToken.findMany({
    where: { userId: payload.sub, revokedAt: null },
  });

  const { compareToken } = await import("../../utils/hash");
  const matchingToken = await Promise.all(
    tokens.map(async (t) => ({ t, match: await compareToken(rawRefreshToken, t.tokenHash) }))
  ).then((results) => results.find((r) => r.match)?.t);

  if (matchingToken) {
    await prisma.refreshToken.update({
      where: { id: matchingToken.id },
      data: { revokedAt: new Date() },
    });
  }
}
