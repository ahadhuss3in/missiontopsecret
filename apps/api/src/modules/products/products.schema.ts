import { z } from "zod";

const storeSlug = z.enum(["zara", "hm", "asos", "shein", "nike"]);
const layerName = z.enum(["underwear", "bottoms", "tops", "outerwear", "shoes", "accessories"]);

export const createProductSchema = z.object({
  title: z.string().min(1).max(200),
  price: z.number().nonnegative(),
  currency: z.string().length(3).default("USD"),
  imageUrl: z.string().url(),
  productUrl: z.string().url(),
  store: storeSlug,
  layer: layerName,
});

export const productQuerySchema = z.object({
  store: storeSlug.optional(),
  layer: layerName.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
