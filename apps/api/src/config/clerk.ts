import { createClerkClient } from "@clerk/backend";
import { env } from "./env";

// Initialize Clerk backend client
export const clerk = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
});

/**
 * Verify a Clerk session token from the Authorization header
 * @param token The Bearer token from the Authorization header
 * @returns The verified session JWT payload
 */
export async function verifyClerkToken(token: string) {
  try {
    if (!token.startsWith("Bearer ")) {
      throw new Error("Invalid token format");
    }

    const sessionToken = token.slice(7); // Remove "Bearer " prefix
    const decoded = await clerk.verifyToken(sessionToken);
    return decoded;
  } catch (error) {
    throw Object.assign(new Error("Invalid or expired token"), {
      status: 401,
      code: "UNAUTHORIZED",
    });
  }
}
