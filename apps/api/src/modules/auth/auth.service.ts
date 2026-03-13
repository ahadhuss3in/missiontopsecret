import { prisma } from "../../config/prisma";

export interface SyncUserData {
  email: string;
  displayName?: string;
}

/**
 * Sync user profile after Clerk authentication
 * Creates or updates user in the database
 */
export async function syncUserProfile(data: SyncUserData, clerkId: string) {
  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {
      email: data.email,
      displayName: data.displayName,
    },
    create: {
      clerkId,
      email: data.email,
      displayName: data.displayName,
    },
    select: {
      id: true,
      clerkId: true,
      email: true,
      displayName: true,
      createdAt: true,
    },
  });

  return user;
}

/**
 * Get current user by their database ID
 */
export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      clerkId: true,
      email: true,
      displayName: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw Object.assign(new Error("User not found"), {
      status: 404,
      code: "USER_NOT_FOUND",
    });
  }

  return user;
}

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
