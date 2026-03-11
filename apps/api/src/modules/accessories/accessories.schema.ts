import { z } from "zod";

const storeSlug = z.enum(["zara", "hm", "asos", "shein", "nike"]);
const accessoryCategory = z.enum(["bag", "belt", "hat", "jewelry", "scarf", "sunglasses", "watch", "hijab", "other"]);

export const createAccessorySchema = z.object({
  title: z.string().min(1).max(200),
  imageUrl: z.string().url(),
  productUrl: z.string().url(),
  store: storeSlug,
  price: z.number().nonnegative(),
  currency: z.string().length(3).default("USD"),
  category: accessoryCategory,
});
