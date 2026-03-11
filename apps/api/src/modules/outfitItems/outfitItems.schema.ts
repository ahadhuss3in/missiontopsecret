import { z } from "zod";

export const addOutfitItemSchema = z.object({
  productId: z.string().cuid(),
  positionX: z.number().min(0).max(1).default(0),
  positionY: z.number().min(0).max(1).default(0),
  scale: z.number().min(0.1).max(3).default(1),
  zIndex: z.number().int().min(0).optional(),
});

export const updateOutfitItemSchema = z.object({
  positionX: z.number().min(0).max(1).optional(),
  positionY: z.number().min(0).max(1).optional(),
  scale: z.number().min(0.1).max(3).optional(),
  zIndex: z.number().int().min(0).optional(),
});
