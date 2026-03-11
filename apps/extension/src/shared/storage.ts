import type { CanvasLayerStack, ExtractedProduct } from "@fashion/shared";

interface LocalStorage {
  accessToken: string | null;
  userId: string | null;
}

interface SessionStorage {
  currentOutfitItems: ExtractedProduct[];
  canvasState: CanvasLayerStack | null;
  overlayPosition: { x: number; y: number } | null;
}

export async function getLocal<K extends keyof LocalStorage>(key: K): Promise<LocalStorage[K]> {
  const result = await chrome.storage.local.get(key);
  return result[key] ?? null;
}

export async function setLocal<K extends keyof LocalStorage>(key: K, value: LocalStorage[K]): Promise<void> {
  await chrome.storage.local.set({ [key]: value });
}

export async function getSession<K extends keyof SessionStorage>(key: K): Promise<SessionStorage[K]> {
  const result = await chrome.storage.session.get(key);
  return result[key] ?? getSessionDefault(key);
}

export async function setSession<K extends keyof SessionStorage>(key: K, value: SessionStorage[K]): Promise<void> {
  await chrome.storage.session.set({ [key]: value });
}

function getSessionDefault<K extends keyof SessionStorage>(key: K): SessionStorage[K] {
  const defaults: SessionStorage = { currentOutfitItems: [], canvasState: null, overlayPosition: null };
  return defaults[key];
}

export async function clearSession(): Promise<void> {
  await chrome.storage.session.clear();
}
