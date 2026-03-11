import { MannequinCanvas } from "./Canvas";
import { DragManager } from "./DragManager";
import type { CanvasLayerStack, ExtractedProduct } from "@fashion/shared";
import { LAYER_LABELS } from "@fashion/shared";

export class Overlay {
  private container: HTMLElement;
  private canvasContainer: HTMLElement;
  private mannequinCanvas: MannequinCanvas;
  private dragManager: DragManager;
  private itemListEl: HTMLElement;
  private visible = false;

  constructor() {
    this.container = this.buildContainer();
    const handle = this.container.querySelector<HTMLElement>(".ff-handle")!;
    this.canvasContainer = this.container.querySelector<HTMLElement>(".ff-canvas")!;
    this.itemListEl = this.container.querySelector<HTMLElement>(".ff-items")!;
    this.mannequinCanvas = new MannequinCanvas(this.canvasContainer);
    this.dragManager = new DragManager(handle, this.container);
    document.body.appendChild(this.container);
  }

  private buildContainer(): HTMLElement {
    const el = document.createElement("div");
    el.id = "fashionfit-overlay";
    el.innerHTML = `
      <div class="ff-handle">
        <span class="ff-logo">👗 FashionFit</span>
        <button class="ff-close">✕</button>
      </div>
      <div class="ff-canvas"></div>
      <div class="ff-items"></div>
      <button class="ff-save-btn">Save Outfit</button>
    `;

    // Inject scoped styles
    const style = document.createElement("style");
    style.textContent = `
      #fashionfit-overlay {
        position: fixed;
        top: 80px;
        right: 20px;
        width: 280px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .ff-handle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        background: #111;
        color: #fff;
        cursor: move;
        user-select: none;
      }
      .ff-logo { font-size: 13px; font-weight: 600; }
      .ff-close {
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
        font-size: 14px;
        padding: 0;
      }
      .ff-canvas {
        height: 300px;
        background: #f5f5f5;
      }
      .ff-items {
        padding: 8px;
        max-height: 120px;
        overflow-y: auto;
        border-top: 1px solid #eee;
      }
      .ff-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 0;
        font-size: 11px;
      }
      .ff-item img { width: 32px; height: 32px; object-fit: cover; border-radius: 4px; }
      .ff-item-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .ff-item-layer {
        font-size: 9px;
        background: #f0f0f0;
        padding: 2px 4px;
        border-radius: 3px;
        text-transform: uppercase;
      }
      .ff-save-btn {
        margin: 8px;
        padding: 10px;
        background: #111;
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
      }
      .ff-save-btn:hover { background: #333; }
    `;
    document.head.appendChild(style);

    el.querySelector(".ff-close")!.addEventListener("click", () => this.hide());
    el.querySelector(".ff-save-btn")!.addEventListener("click", () => {
      const name = prompt("Name your outfit:", "My Outfit");
      if (name) chrome.runtime.sendMessage({ type: "POPUP_SAVE_OUTFIT", payload: { name } });
    });

    return el;
  }

  update(items: ExtractedProduct[], canvasState: CanvasLayerStack) {
    this.show();
    this.mannequinCanvas.render(canvasState);
    this.itemListEl.innerHTML = items
      .map(
        (p) => `
      <div class="ff-item">
        <img src="${p.imageUrl}" alt="" crossorigin="anonymous" />
        <span class="ff-item-title">${p.title}</span>
        <span class="ff-item-layer">${LAYER_LABELS[p.layer]}</span>
      </div>
    `
      )
      .join("");
  }

  show() {
    this.container.style.display = "flex";
    this.visible = true;
  }

  hide() {
    this.container.style.display = "none";
    this.visible = false;
  }

  destroy() {
    this.dragManager.destroy();
    this.mannequinCanvas.destroy();
    this.container.remove();
  }
}
