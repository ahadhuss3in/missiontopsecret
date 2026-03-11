import type { IStoreDetector } from "./detector.interface";
import type { ExtractedProduct } from "@fashion/shared";
import { guessLayer } from "./utils";

export class HMDetector implements IStoreDetector {
  isProductPage(): boolean {
    return (
      !!document.querySelector(".product-detail-main") ||
      !!document.querySelector('[data-elid="product-name"]')
    );
  }

  extract(): ExtractedProduct | null {
    const title =
      document.querySelector<HTMLElement>('[data-elid="product-name"]')?.textContent?.trim() ??
      document.querySelector<HTMLElement>("h1")?.textContent?.trim();

    const priceEl = document.querySelector<HTMLElement>(".ProductDetails-module--price, .price");
    const price = parseFloat(priceEl?.textContent?.replace(/[^0-9.]/g, "") ?? "0");

    const imageEl = document.querySelector<HTMLImageElement>(".product-detail-main img, .product__image img");
    const imageUrl = imageEl?.src ?? "";

    if (!title || !imageUrl) return null;

    return {
      title,
      price,
      currency: "USD",
      imageUrl,
      productUrl: window.location.href,
      store: "hm",
      layer: guessLayer(title),
    };
  }
}
