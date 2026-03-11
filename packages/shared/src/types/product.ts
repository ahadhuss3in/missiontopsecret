import type { StoreSlug } from "../constants/stores";
import type { LayerName } from "../constants/layers";

export interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  productUrl: string;
  store: StoreSlug;
  layer: LayerName;
  userId: string;
  createdAt: string;
}

export interface CreateProductDto {
  title: string;
  price: number;
  currency?: string;
  imageUrl: string;
  productUrl: string;
  store: StoreSlug;
  layer: LayerName;
}

// Raw data extracted by extension content script before saving to API
export interface ExtractedProduct {
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  productUrl: string;
  store: StoreSlug;
  layer: LayerName;
}
