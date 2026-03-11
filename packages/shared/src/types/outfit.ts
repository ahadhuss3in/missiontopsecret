import type { LayerName } from "../constants/layers";
import type { Product } from "./product";
import type { OutfitItem } from "./outfitItem";

export interface CanvasLayer {
  layerName: LayerName;
  productId: string;
  imageUrl: string;
  positionX: number; // 0.0–1.0 relative to canvas width
  positionY: number; // 0.0–1.0 relative to canvas height
  scale: number;
  zIndex: number;
}

export interface CanvasLayerStack {
  layers: CanvasLayer[];
  mannequinScale: number; // 0.5–2.0
  backgroundColor: string; // hex e.g. "#f5f5f5"
}

export interface Outfit {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  canvasState: CanvasLayerStack | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OutfitWithItems extends Outfit {
  items: (OutfitItem & { product: Product })[];
}

export interface CreateOutfitDto {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateOutfitDto {
  name?: string;
  description?: string;
  isPublic?: boolean;
  canvasState?: CanvasLayerStack;
}
