const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

let _accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(_accessToken ? { Authorization: `Bearer ${_accessToken}` } : {}),
    ...(init.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers, credentials: "include" });

  // Try to refresh if 401
  if (res.status === 401 && path !== "/auth/refresh") {
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, { method: "POST", credentials: "include" });
    if (refreshRes.ok) {
      const { data } = await refreshRes.json();
      _accessToken = data.accessToken;
      return request<T>(path, init); // retry once
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: { code: "UNKNOWN", message: res.statusText } }));
    throw new ApiError(res.status, body.error?.code ?? "UNKNOWN", body.error?.message ?? "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const apiGet = <T>(path: string) => request<T>(path, { method: "GET" });
export const apiPost = <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) });
export const apiPatch = <T>(path: string, body: unknown) => request<T>(path, { method: "PATCH", body: JSON.stringify(body) });
export const apiDelete = <T>(path: string) => request<T>(path, { method: "DELETE" });
