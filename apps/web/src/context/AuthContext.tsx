"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AuthUser } from "@fashion/shared";
import { apiPost } from "@/lib/api";

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokenAndUser: (token: string, user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const setTokenAndUser = useCallback((token: string, u: AuthUser) => {
    setAccessToken(token);
    setUser(u);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiPost<{ data: { user: AuthUser; accessToken: string } }>("/auth/login", { email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  }, []);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    const res = await apiPost<{ data: { user: AuthUser; accessToken: string } }>("/auth/register", { email, password, displayName });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  }, []);

  const logout = useCallback(async () => {
    await apiPost("/auth/logout", {}).catch(() => {});
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register, logout, setTokenAndUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
