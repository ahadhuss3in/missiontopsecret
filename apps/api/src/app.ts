import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { authRouter } from "./modules/auth/auth.router";
import { productsRouter } from "./modules/products/products.router";
import { outfitsRouter } from "./modules/outfits/outfits.router";
import { accessoriesRouter } from "./modules/accessories/accessories.router";
import { errorHandler } from "./middleware/error.middleware";

export function createApp() {
  const app = express();

  // Security
  app.use(helmet());
  app.use(
    cors({
      origin: [env.CORS_ORIGIN, "chrome-extension://"],
      credentials: true,
    })
  );

  // Rate limiting
  app.use(
    "/api/v1/auth",
    rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: { code: "RATE_LIMITED", message: "Too many requests" } } })
  );
  app.use(
    "/api",
    rateLimit({ windowMs: 60 * 1000, max: 200, message: { error: { code: "RATE_LIMITED", message: "Too many requests" } } })
  );

  // Body parsing
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  // Health check
  app.get("/health", (_req, res) => res.json({ status: "ok", ts: new Date().toISOString() }));

  // Routes
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/products", productsRouter);
  app.use("/api/v1/outfits", outfitsRouter);
  app.use("/api/v1/accessories", accessoriesRouter);

  // 404
  app.use((_req, res) => res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } }));

  // Global error handler
  app.use(errorHandler);

  return app;
}
