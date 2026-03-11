import { MessageType, type ExtensionMessage } from "../shared/messages";
import { getLocal, setLocal, getSession, setSession, clearSession } from "../shared/storage";
import { api } from "../shared/api";
import type { ExtractedProduct, CanvasLayerStack } from "@fashion/shared";
import { LAYER_ORDER } from "@fashion/shared";

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildCanvasState(items: ExtractedProduct[]): CanvasLayerStack {
  return {
    layers: items.map((p, i) => ({
      layerName: p.layer,
      productId: `temp-${i}`,
      imageUrl: p.imageUrl,
      positionX: 0.1,
      positionY: 0.1 * i,
      scale: 1,
      zIndex: LAYER_ORDER[p.layer] ?? 3,
    })),
    mannequinScale: 1,
    backgroundColor: "#f5f5f5",
  };
}

async function broadcastToActiveTab(message: ExtensionMessage) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) chrome.tabs.sendMessage(tab.id, message);
}

async function syncPopup(sendResponse: (r: unknown) => void, error?: string) {
  const accessToken = await getLocal("accessToken");
  const items = await getSession("currentOutfitItems");
  const canvasState = await getSession("canvasState");
  sendResponse({
    type: MessageType.POPUP_STATE_SYNC,
    payload: {
      isAuthenticated: !!accessToken,
      currentOutfitItemCount: items.length,
      canvasState,
      error,
    },
  });
}

// ── Message Listener ─────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  handleMessage(message, sendResponse);
  return true; // keep sendResponse alive for async handlers
});

async function handleMessage(message: ExtensionMessage, sendResponse: (r: unknown) => void) {
  switch (message.type) {
    case MessageType.ADD_TO_OUTFIT: {
      const { product } = message.payload;
      const items = await getSession("currentOutfitItems");
      // Avoid duplicates by productUrl
      if (!items.find((i) => i.productUrl === product.productUrl)) {
        items.push(product);
        await setSession("currentOutfitItems", items);
      }
      const canvasState = buildCanvasState(items);
      await setSession("canvasState", canvasState);
      chrome.action.setBadgeText({ text: String(items.length) });
      chrome.action.setBadgeBackgroundColor({ color: "#000000" });
      await broadcastToActiveTab({ type: MessageType.OUTFIT_UPDATED, payload: { items, canvasState } });
      sendResponse({ ok: true });
      break;
    }

    case MessageType.POPUP_OPENED:
    case MessageType.GET_OUTFIT_STATE: {
      await syncPopup(sendResponse);
      break;
    }

    case MessageType.POPUP_LOGIN: {
      const { email, password } = message.payload;
      try {
        const res = await api.post<{ data: { accessToken: string; user: { id: string } } }>(
          "/auth/login",
          { email, password }
        );
        await setLocal("accessToken", res.data.accessToken);
        await setLocal("userId", res.data.user.id);
        await syncPopup(sendResponse);
      } catch (err: unknown) {
        await syncPopup(sendResponse, (err as Error).message);
      }
      break;
    }

    case MessageType.POPUP_LOGOUT: {
      await api.post("/auth/logout", {}).catch(() => {});
      await setLocal("accessToken", null);
      await setLocal("userId", null);
      await clearSession();
      chrome.action.setBadgeText({ text: "" });
      await syncPopup(sendResponse);
      break;
    }

    case MessageType.POPUP_SAVE_OUTFIT: {
      const { name } = message.payload;
      const items = await getSession("currentOutfitItems");
      const canvasState = await getSession("canvasState");

      try {
        // 1. Create outfit record
        const outfitRes = await api.post<{ data: { id: string } }>("/outfits", { name });
        const outfitId = outfitRes.data.id;

        // 2. Save each product and link to outfit
        for (const product of items) {
          const productRes = await api.post<{ data: { id: string } }>("/products", product);
          const productId = productRes.data.id;
          await api.post(`/outfits/${outfitId}/items`, { productId });
        }

        // 3. Save canvas state
        if (canvasState) {
          await api.patch(`/outfits/${outfitId}`, { canvasState });
        }

        // 4. Clear local outfit state
        await clearSession();
        chrome.action.setBadgeText({ text: "" });
        await syncPopup(sendResponse);
      } catch (err: unknown) {
        await syncPopup(sendResponse, (err as Error).message);
      }
      break;
    }

    case MessageType.POPUP_CLEAR_OUTFIT: {
      await clearSession();
      chrome.action.setBadgeText({ text: "" });
      await syncPopup(sendResponse);
      break;
    }

    default:
      sendResponse({ ok: false });
  }
}
