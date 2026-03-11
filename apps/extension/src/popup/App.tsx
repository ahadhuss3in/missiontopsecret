import { useEffect, useState } from "react";
import { MessageType, type PopupStateSyncMessage } from "../shared/messages";
import { AuthView } from "./components/AuthView";
import { OutfitView } from "./components/OutfitView";
import type { CanvasLayerStack } from "@fashion/shared";

interface PopupState {
  isAuthenticated: boolean;
  currentOutfitItemCount: number;
  canvasState: CanvasLayerStack | null;
  error?: string;
  loading: boolean;
}

export function App() {
  const [state, setState] = useState<PopupState>({
    isAuthenticated: false,
    currentOutfitItemCount: 0,
    canvasState: null,
    loading: true,
  });

  useEffect(() => {
    chrome.runtime.sendMessage({ type: MessageType.POPUP_OPENED }, (response: PopupStateSyncMessage) => {
      if (response?.payload) {
        setState({ ...response.payload, loading: false });
      }
    });
  }, []);

  const handleLogin = (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true }));
    chrome.runtime.sendMessage(
      { type: MessageType.POPUP_LOGIN, payload: { email, password } },
      (response: PopupStateSyncMessage) => {
        if (response?.payload) setState({ ...response.payload, loading: false });
      }
    );
  };

  const handleLogout = () => {
    chrome.runtime.sendMessage({ type: MessageType.POPUP_LOGOUT }, (response: PopupStateSyncMessage) => {
      if (response?.payload) setState({ ...response.payload, loading: false });
    });
  };

  const handleSave = (name: string) => {
    setState((s) => ({ ...s, loading: true }));
    chrome.runtime.sendMessage(
      { type: MessageType.POPUP_SAVE_OUTFIT, payload: { name } },
      (response: PopupStateSyncMessage) => {
        if (response?.payload) setState({ ...response.payload, loading: false });
      }
    );
  };

  const handleClear = () => {
    chrome.runtime.sendMessage({ type: MessageType.POPUP_CLEAR_OUTFIT }, (response: PopupStateSyncMessage) => {
      if (response?.payload) setState({ ...response.payload, loading: false });
    });
  };

  if (state.loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
        <span>Loading...</span>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return <AuthView onLogin={handleLogin} error={state.error} />;
  }

  return (
    <OutfitView
      itemCount={state.currentOutfitItemCount}
      canvasState={state.canvasState}
      onSave={handleSave}
      onClear={handleClear}
      onLogout={handleLogout}
      error={state.error}
    />
  );
}
