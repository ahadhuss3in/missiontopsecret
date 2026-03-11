import { ZaraDetector } from "./detectors/zara.detector";
import { HMDetector } from "./detectors/hm.detector";
import { ASOSDetector } from "./detectors/asos.detector";
import { SheinDetector } from "./detectors/shein.detector";
import { NikeDetector } from "./detectors/nike.detector";
import type { IStoreDetector } from "./detectors/detector.interface";
import { injectAddToOutfitButton } from "./ui/AddToOutfitButton";
import { Overlay } from "./overlay/Overlay";
import { MessageType, type OutfitUpdatedMessage } from "../shared/messages";
import { detectStore } from "@fashion/shared";

// ── Determine which detector to use ──────────────────────────────────────────

const hostname = window.location.hostname;
const storeSlug = detectStore(hostname);

const DETECTORS: Record<string, IStoreDetector> = {
  zara: new ZaraDetector(),
  hm: new HMDetector(),
  asos: new ASOSDetector(),
  shein: new SheinDetector(),
  nike: new NikeDetector(),
};

const detector = storeSlug ? DETECTORS[storeSlug] : null;

if (!detector || !detector.isProductPage()) {
  // Not a product page — exit silently
} else {
  const product = detector.extract();

  if (product) {
    injectAddToOutfitButton(product);

    // Create overlay (hidden initially)
    const overlay = new Overlay();

    // Listen for outfit updates from background
    chrome.runtime.onMessage.addListener((message: OutfitUpdatedMessage) => {
      if (message.type === MessageType.OUTFIT_UPDATED) {
        overlay.update(message.payload.items, message.payload.canvasState);
      }
    });

    // Ask background for current outfit state on load (in case user already has items)
    chrome.runtime.sendMessage({ type: MessageType.GET_OUTFIT_STATE }, (response) => {
      if (response?.payload?.canvasState && response.payload.currentOutfitItemCount > 0) {
        overlay.show();
      }
    });
  }
}
