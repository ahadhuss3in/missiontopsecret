import type { IStoreDetector } from "./detector.interface";
import type { ExtractedProduct } from "@fashion/shared";
import { guessLayer } from "./utils";

export class ASOSDetector implements IStoreDetector {
  isProductPage(): boolean {
    return !!document.querySelector('[data-auto-id="product-title"]');
  }

  extract(): ExtractedProduct | null {
    const title = document.querySelector<HTMLElement>('[data-auto-id="product-title"]')?.textContent?.trim();
    const priceEl = document.querySelector<HTMLElement>('[data-auto-id="product-price"] span');
    const price = parseFloat(priceEl?.textContent?.replace(/[^0-9.]/g, "") ?? "0");
    const imageEl = document.querySelector<HTMLImageElement>('[data-auto-id="hero-img"] img, .product-hero__image img');
    const imageUrl = imageEl?.src ?? "";

    if (!title || !imageUrl) return null;

    return { title, price, currency: "USD", imageUrl, productUrl: window.location.href, store: "asos", layer: guessLayer(title) };
  }
}
