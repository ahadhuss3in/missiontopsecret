import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { TokenPayload } from "@fashion/shared";

export function signAccessToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email }, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
