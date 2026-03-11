import type { ExtractedProduct } from "@fashion/shared";

export interface IStoreDetector {
  /** Returns true if the current page is a product detail page */
  isProductPage(): boolean;

  /** Extracts product data from the DOM. Call only after isProductPage() returns true */
  extract(): ExtractedProduct | null;
}
