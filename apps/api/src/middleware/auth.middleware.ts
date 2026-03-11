import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../config/prisma";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Missing access token" } });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    // lightweight check that user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true },
    });
    if (!user) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "User not found" } });
      return;
    }
    req.userId = user.id;
    req.userEmail = user.email;
    next();
  } catch {
    res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid or expired token" } });
  }
}
