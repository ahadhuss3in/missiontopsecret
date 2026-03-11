import type { IStoreDetector } from "./detector.interface";
import type { ExtractedProduct } from "@fashion/shared";
import { guessLayer } from "./utils";

export class ZaraDetector implements IStoreDetector {
  isProductPage(): boolean {
    return !!document.querySelector('[class*="product-detail"]') || !!document.querySelector(".pdp-layout");
  }

  extract(): ExtractedProduct | null {
    const title = document.querySelector<HTMLElement>('[class*="product-detail-description__header"]')?.textContent?.trim()
      ?? document.querySelector<HTMLElement>("h1")?.textContent?.trim();

    const priceEl = document.querySelector<HTMLElement>('[class*="money-amount"]');
    const priceText = priceEl?.textContent?.replace(/[^0-9.]/g, "") ?? "0";
    const price = parseFloat(priceText);

    const imageEl = document.querySelector<HTMLImageElement>(
      '[class*="product-detail-image"] img, [class*="media-image"] img'
    );
    const imageUrl = imageEl?.src ?? imageEl?.dataset.src ?? "";

    if (!title || !imageUrl) return null;

    return {
      title,
      price,
      currency: "USD",
      imageUrl,
      productUrl: window.location.href,
      store: "zara",
      layer: guessLayer(title),
    };
  }
}
