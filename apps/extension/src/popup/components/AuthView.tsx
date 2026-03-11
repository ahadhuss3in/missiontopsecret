import { useState } from "react";

interface Props {
  onLogin: (email: string, password: string) => void;
  error?: string;
}

export function AuthView({ onLogin, error }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const s = {
    container: { padding: "24px", background: "#fff" } as React.CSSProperties,
    header: { fontSize: 18, fontWeight: 700, marginBottom: 4 } as React.CSSProperties,
    sub: { fontSize: 12, color: "#666", marginBottom: 20 } as React.CSSProperties,
    label: { fontSize: 12, fontWeight: 600, marginBottom: 4, display: "block" } as React.CSSProperties,
    input: { width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13, marginBottom: 12 } as React.CSSProperties,
    btn: { width: "100%", padding: "10px", background: "#111", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" } as React.CSSProperties,
    error: { color: "#dc2626", fontSize: 12, marginBottom: 12 } as React.CSSProperties,
  };

  return (
    <div style={s.container}>
      <div style={s.header}>👗 FashionFit</div>
      <div style={s.sub}>Sign in to save outfits</div>
      {error && <div style={s.error}>{error}</div>}
      <label style={s.label}>Email</label>
      <input style={s.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <label style={s.label}>Password</label>
      <input style={s.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      <button style={s.btn} onClick={() => onLogin(email, password)}>Sign In</button>
    </div>
  );
}
