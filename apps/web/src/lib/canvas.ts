import type { CanvasLayerStack } from "@fashion/shared";

export async function renderOutfitCanvas(
  canvas: HTMLCanvasElement,
  state: CanvasLayerStack,
  mannequinUrl?: string
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = state.backgroundColor;
  ctx.fillRect(0, 0, W, H);

  // Draw mannequin silhouette
  if (mannequinUrl) {
    const mImg = await loadImage(mannequinUrl);
    const mW = W * 0.5 * state.mannequinScale;
    const mH = H * 0.85 * state.mannequinScale;
    ctx.globalAlpha = 0.12;
    ctx.drawImage(mImg, (W - mW) / 2, (H - mH) / 2, mW, mH);
    ctx.globalAlpha = 1;
  }

  const sorted = [...state.layers].sort((a, b) => a.zIndex - b.zIndex);
  for (const layer of sorted) {
    try {
      const img = await loadImage(layer.imageUrl);
      ctx.drawImage(img, layer.positionX * W, layer.positionY * H, img.naturalWidth * layer.scale * 0.4, img.naturalHeight * layer.scale * 0.4);
    } catch {
      // Skip
    }
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
