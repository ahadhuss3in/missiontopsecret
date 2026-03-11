import type { CanvasLayerStack } from "@fashion/shared";

const CANVAS_W = 480;
const CANVAS_H = 720;

export class MannequinCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mannequinImg: HTMLImageElement | null = null;
  private imageCache = new Map<string, HTMLImageElement>();

  constructor(container: HTMLElement) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = CANVAS_W;
    this.canvas.height = CANVAS_H;
    this.canvas.style.cssText = "width:100%;height:100%;display:block;";
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d")!;
    this.loadMannequin();
  }

  private loadMannequin() {
    const url = chrome.runtime.getURL("mannequin/body-silhouette.png");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      this.mannequinImg = img;
    };
    img.src = url;
  }

  private async loadImage(url: string): Promise<HTMLImageElement> {
    if (this.imageCache.has(url)) return this.imageCache.get(url)!;
    return new Promise((resolve, reject) => {
      const img = new Image();
      // Note: cross-origin product images cannot be drawn with toDataURL without CORS headers.
      // We intentionally avoid calling toDataURL to keep canvas untainted.
      img.crossOrigin = "anonymous";
      img.onload = () => {
        this.imageCache.set(url, img);
        resolve(img);
      };
      img.onerror = () => {
        // Fallback: draw without crossOrigin (untainted read will fail but visual still works)
        const fallback = new Image();
        fallback.onload = () => { this.imageCache.set(url, fallback); resolve(fallback); };
        fallback.onerror = reject;
        fallback.src = url;
      };
      img.src = url;
    });
  }

  async render(state: CanvasLayerStack) {
    const { ctx } = this;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background
    ctx.fillStyle = state.backgroundColor;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Base mannequin silhouette
    if (this.mannequinImg) {
      const scale = state.mannequinScale;
      const w = CANVAS_W * 0.5 * scale;
      const h = CANVAS_H * 0.85 * scale;
      ctx.globalAlpha = 0.15;
      ctx.drawImage(this.mannequinImg, (CANVAS_W - w) / 2, (CANVAS_H - h) / 2, w, h);
      ctx.globalAlpha = 1;
    }

    // Sort layers by zIndex
    const sorted = [...state.layers].sort((a, b) => a.zIndex - b.zIndex);

    for (const layer of sorted) {
      try {
        const img = await this.loadImage(layer.imageUrl);
        const x = layer.positionX * CANVAS_W;
        const y = layer.positionY * CANVAS_H;
        const w = img.naturalWidth * layer.scale * 0.4;
        const h = img.naturalHeight * layer.scale * 0.4;
        ctx.drawImage(img, x, y, w, h);
      } catch {
        // Skip images that fail to load
      }
    }
  }

  destroy() {
    this.canvas.remove();
    this.imageCache.clear();
  }
}
