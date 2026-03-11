export type LayerName =
  | "underwear"
  | "bottoms"
  | "tops"
  | "outerwear"
  | "shoes"
  | "accessories";

// z-index order for canvas rendering (lower = rendered first / behind)
export const LAYER_ORDER: Record<LayerName, number> = {
  underwear: 1,
  bottoms: 2,
  tops: 3,
  outerwear: 4,
  accessories: 5,
  shoes: 6,
};

export const LAYER_LABELS: Record<LayerName, string> = {
  underwear: "Underwear",
  bottoms: "Bottoms",
  tops: "Tops",
  outerwear: "Outerwear",
  shoes: "Shoes",
  accessories: "Accessories",
};
