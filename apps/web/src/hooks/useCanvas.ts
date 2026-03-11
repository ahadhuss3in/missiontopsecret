"use client";

import { useEffect, useRef } from "react";
import type { CanvasLayerStack } from "@fashion/shared";
import { renderOutfitCanvas } from "@/lib/canvas";

export function useCanvas(state: CanvasLayerStack | null | undefined) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !state) return;
    renderOutfitCanvas(canvasRef.current, state);
  }, [state]);

  return canvasRef;
}
