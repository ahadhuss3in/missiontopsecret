import { useState } from "react";
import type { CanvasLayerStack } from "@fashion/shared";

interface Props {
  itemCount: number;
  canvasState: CanvasLayerStack | null;
  onSave: (name: string) => void;
  onClear: () => void;
  onLogout: () => void;
  error?: string;
}

export function OutfitView({ itemCount, onSave, onClear, onLogout, error }: Props) {
  const [outfitName, setOutfitName] = useState("My Outfit");

  const s = {
    container: { padding: "16px", background: "#fff", minHeight: 300 } as React.CSSProperties,
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } as React.CSSProperties,
    title: { fontSize: 15, fontWeight: 700 } as React.CSSProperties,
    logout: { fontSize: 11, color: "#666", cursor: "pointer", background: "none", border: "none" } as React.CSSProperties,
    count: { textAlign: "center" as const, padding: "24px 0", fontSize: 14, color: "#444" },
    input: { width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13, marginBottom: 10 } as React.CSSProperties,
    row: { display: "flex", gap: 8, marginTop: 8 } as React.CSSProperties,
    saveBtn: { flex: 1, padding: "10px", background: "#111", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" } as React.CSSProperties,
    clearBtn: { padding: "10px 14px", background: "#f5f5f5", color: "#111", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" } as React.CSSProperties,
    error: { color: "#dc2626", fontSize: 12, marginBottom: 10 } as React.CSSProperties,
    tip: { fontSize: 11, color: "#888", textAlign: "center" as const, marginTop: 16 },
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <span style={s.title}>👗 FashionFit</span>
        <button style={s.logout} onClick={onLogout}>Sign out</button>
      </div>

      <div style={s.count}>
        {itemCount === 0 ? (
          <>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🛍️</div>
            <div>No items yet.</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
              Browse a product page and click "Add to Outfit"
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 32, marginBottom: 4 }}>✓</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{itemCount} item{itemCount !== 1 ? "s" : ""}</div>
            <div style={{ fontSize: 12, color: "#888" }}>in your current outfit</div>
          </>
        )}
      </div>

      {error && <div style={s.error}>{error}</div>}

      {itemCount > 0 && (
        <>
          <input
            style={s.input}
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
            placeholder="Outfit name..."
          />
          <div style={s.row}>
            <button style={s.saveBtn} onClick={() => onSave(outfitName)}>
              Save Outfit
            </button>
            <button style={s.clearBtn} onClick={onClear} title="Clear outfit">✕</button>
          </div>
        </>
      )}

      <div style={s.tip}>
        <a href="http://localhost:3000/dashboard" target="_blank" rel="noreferrer" style={{ color: "#666" }}>
          View all saved outfits →
        </a>
      </div>
    </div>
  );
}
