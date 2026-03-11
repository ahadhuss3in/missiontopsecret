import type { IStoreDetector } from "./detector.interface";
import type { ExtractedProduct } from "@fashion/shared";
import { guessLayer } from "./utils";

export class SheinDetector implements IStoreDetector {
  isProductPage(): boolean {
    return !!document.querySelector(".goods-name") || !!document.querySelector(".product-intro__head-name");
  }

  extract(): ExtractedProduct | null {
    const title =
      document.querySelector<HTMLElement>(".goods-name, .product-intro__head-name")?.textContent?.trim();
    const priceEl = document.querySelector<HTMLElement>(".product-intro__head-price .from, .original-price");
    const price = parseFloat(priceEl?.textContent?.replace(/[^0-9.]/g, "") ?? "0");
    const imageEl = document.querySelector<HTMLImageElement>(".product-intro__thumbs-item.active img, .crop-image-container img");
    const imageUrl = imageEl?.src ?? "";

    if (!title || !imageUrl) return null;

    return { title, price, currency: "USD", imageUrl, productUrl: window.location.href, store: "shein", layer: guessLayer(title) };
  }
}
