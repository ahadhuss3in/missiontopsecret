import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details: Record<string, string[]> = {};
      (result.error as ZodError).errors.forEach((e) => {
        const key = e.path.join(".");
        details[key] = [...(details[key] ?? []), e.message];
      });
      res.status(422).json({ error: { code: "VALIDATION_ERROR", message: "Invalid input", details } });
      return;
    }
    req.body = result.data;
    next();
  };
}
