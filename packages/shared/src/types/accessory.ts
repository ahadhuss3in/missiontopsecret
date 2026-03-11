import type { StoreSlug } from "../constants/stores";

export type AccessoryCategory =
  | "bag"
  | "belt"
  | "hat"
  | "jewelry"
  | "scarf"
  | "sunglasses"
  | "watch"
  | "hijab"
  | "other";

export interface Accessory {
  id: string;
  title: string;
  imageUrl: string;
  productUrl: string;
  store: StoreSlug;
  price: number;
  currency: string;
  category: AccessoryCategory;
  userId: string;
  createdAt: string;
}

export interface CreateAccessoryDto {
  title: string;
  imageUrl: string;
  productUrl: string;
  store: StoreSlug;
  price: number;
  currency?: string;
  category: AccessoryCategory;
}
