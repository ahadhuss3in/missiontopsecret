export interface OutfitItem {
  id: string;
  outfitId: string;
  productId: string;
  positionX: number;
  positionY: number;
  scale: number;
  zIndex: number;
  addedAt: string;
}

export interface AddOutfitItemDto {
  productId: string;
  positionX?: number;
  positionY?: number;
  scale?: number;
  zIndex?: number;
}

export interface UpdateOutfitItemDto {
  positionX?: number;
  positionY?: number;
  scale?: number;
  zIndex?: number;
}
