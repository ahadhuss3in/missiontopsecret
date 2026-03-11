import type { ExtractedProduct, CanvasLayerStack } from "@fashion/shared";

export enum MessageType {
  // Content -> Background
  ADD_TO_OUTFIT = "ADD_TO_OUTFIT",
  SAVE_OUTFIT = "SAVE_OUTFIT",
  GET_OUTFIT_STATE = "GET_OUTFIT_STATE",

  // Background -> Content
  OUTFIT_UPDATED = "OUTFIT_UPDATED",

  // Popup -> Background
  POPUP_OPENED = "POPUP_OPENED",
  POPUP_LOGIN = "POPUP_LOGIN",
  POPUP_LOGOUT = "POPUP_LOGOUT",
  POPUP_SAVE_OUTFIT = "POPUP_SAVE_OUTFIT",
  POPUP_CLEAR_OUTFIT = "POPUP_CLEAR_OUTFIT",

  // Background -> Popup
  POPUP_STATE_SYNC = "POPUP_STATE_SYNC",
}

export interface AddToOutfitMessage {
  type: MessageType.ADD_TO_OUTFIT;
  payload: { product: ExtractedProduct };
}

export interface SaveOutfitMessage {
  type: MessageType.SAVE_OUTFIT;
  payload: { name: string; canvasState: CanvasLayerStack };
}

export interface OutfitUpdatedMessage {
  type: MessageType.OUTFIT_UPDATED;
  payload: { items: ExtractedProduct[]; canvasState: CanvasLayerStack };
}

export interface PopupLoginMessage {
  type: MessageType.POPUP_LOGIN;
  payload: { email: string; password: string };
}

export interface PopupSaveOutfitMessage {
  type: MessageType.POPUP_SAVE_OUTFIT;
  payload: { name: string };
}

export interface PopupStateSyncMessage {
  type: MessageType.POPUP_STATE_SYNC;
  payload: {
    isAuthenticated: boolean;
    currentOutfitItemCount: number;
    canvasState: CanvasLayerStack | null;
    error?: string;
  };
}

export type ExtensionMessage =
  | AddToOutfitMessage
  | SaveOutfitMessage
  | OutfitUpdatedMessage
  | PopupLoginMessage
  | PopupSaveOutfitMessage
  | PopupStateSyncMessage
  | { type: MessageType.POPUP_OPENED | MessageType.POPUP_LOGOUT | MessageType.POPUP_CLEAR_OUTFIT | MessageType.GET_OUTFIT_STATE };
