import type { IStoreDetector } from "./detector.interface";
import type { ExtractedProduct } from "@fashion/shared";
import { guessLayer } from "./utils";

export class NikeDetector implements IStoreDetector {
  isProductPage(): boolean {
    return !!document.querySelector('[data-test="product-title"]') || !!document.querySelector(".product-info");
  }

  extract(): ExtractedProduct | null {
    const title = document.querySelector<HTMLElement>('[data-test="product-title"]')?.textContent?.trim();
    const priceEl = document.querySelector<HTMLElement>('[data-test="product-price"]');
    const price = parseFloat(priceEl?.textContent?.replace(/[^0-9.]/g, "") ?? "0");
    const imageEl = document.querySelector<HTMLImageElement>(".pdp-6up-hero img, [data-component-id*=\"hero\"] img");
    const imageUrl = imageEl?.src ?? "";

    if (!title || !imageUrl) return null;

    return { title, price, currency: "USD", imageUrl, productUrl: window.location.href, store: "nike", layer: guessLayer(title) };
  }
}
