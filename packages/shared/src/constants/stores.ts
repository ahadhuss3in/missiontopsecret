export type StoreSlug = "zara" | "hm" | "asos" | "shein" | "nike";

export const SUPPORTED_STORES: Record<StoreSlug, { name: string; hostname: string }> = {
  zara: { name: "Zara", hostname: "www.zara.com" },
  hm: { name: "H&M", hostname: "www2.hm.com" },
  asos: { name: "ASOS", hostname: "www.asos.com" },
  shein: { name: "Shein", hostname: "www.shein.com" },
  nike: { name: "Nike", hostname: "www.nike.com" },
};

export function detectStore(hostname: string): StoreSlug | null {
  for (const [slug, info] of Object.entries(SUPPORTED_STORES)) {
    if (hostname.includes(info.hostname)) return slug as StoreSlug;
  }
  return null;
}
