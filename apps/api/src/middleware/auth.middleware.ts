import type { Request, Response, NextFunction } from "express";
import { verifyClerkToken } from "../config/clerk";
import { prisma } from "../config/prisma";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      clerkId?: string;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Missing authorization header" } });
    return;
  }

  try {
    // Verify Clerk token
    const payload = await verifyClerkToken(authHeader);
    const clerkId = payload.sub; // Clerk's user ID

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, clerkId: true, email: true },
    });

    if (!user) {
      // Create user from Clerk data
      user = await prisma.user.create({
        data: {
          clerkId,
          email: payload.email || "",
          displayName: payload.name || undefined,
        },
        select: { id: true, clerkId: true, email: true },
      });
    }

    req.userId = user.id;
    req.clerkId = clerkId;
    req.userEmail = user.email;
    next();
  } catch (error) {
    const err = error as any;
    res.status(err.status || 401).json({
      error: {
        code: err.code || "UNAUTHORIZED",
        message: err.message || "Invalid or expired token",
      },
    });
  }
}
