import type { ExtractedProduct } from "@fashion/shared";
import { MessageType } from "../../shared/messages";

const BUTTON_ID = "fashionfit-add-btn";

export function injectAddToOutfitButton(product: ExtractedProduct) {
  if (document.getElementById(BUTTON_ID)) return;

  const btn = document.createElement("button");
  btn.id = BUTTON_ID;
  btn.textContent = "👗 Add to Outfit";
  btn.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483646;
    background: #111;
    color: #fff;
    border: none;
    padding: 14px 22px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    transition: background 0.2s;
  `;

  btn.addEventListener("mouseenter", () => (btn.style.background = "#333"));
  btn.addEventListener("mouseleave", () => (btn.style.background = "#111"));

  btn.addEventListener("click", () => {
    btn.textContent = "✓ Added!";
    btn.style.background = "#16a34a";
    setTimeout(() => {
      btn.textContent = "👗 Add to Outfit";
      btn.style.background = "#111";
    }, 1500);
    chrome.runtime.sendMessage({ type: MessageType.ADD_TO_OUTFIT, payload: { product } });
  });

  document.body.appendChild(btn);
}
