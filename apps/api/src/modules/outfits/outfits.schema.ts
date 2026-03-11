import { z } from "zod";

export const createOutfitSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(false),
});

export const updateOutfitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
  canvasState: z.object({
    layers: z.array(z.any()),
    mannequinScale: z.number().min(0.5).max(2),
    backgroundColor: z.string(),
  }).optional(),
});
