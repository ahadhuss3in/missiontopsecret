import type { LayerName } from "@fashion/shared";

// Simple keyword-based layer guesser
const LAYER_KEYWORDS: Array<{ keywords: string[]; layer: LayerName }> = [
  { keywords: ["shoe", "boot", "sneaker", "heel", "sandal", "loafer", "trainer"], layer: "shoes" },
  { keywords: ["pant", "jean", "trouser", "skirt", "short", "legging", "chino"], layer: "bottoms" },
  { keywords: ["jacket", "coat", "blazer", "hoodie", "cardigan", "parka", "windbreaker"], layer: "outerwear" },
  { keywords: ["bag", "belt", "hat", "cap", "scarf", "sunglasses", "glasses", "watch", "ring", "necklace", "hijab"], layer: "accessories" },
  { keywords: ["bra", "brief", "underwear", "boxer", "panty", "lingerie"], layer: "underwear" },
];

export function guessLayer(title: string): LayerName {
  const lower = title.toLowerCase();
  for (const { keywords, layer } of LAYER_KEYWORDS) {
    if (keywords.some((k) => lower.includes(k))) return layer;
  }
  return "tops"; // default
}
