export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface TokenPayload {
  sub: string; // userId
  email: string;
  iat: number;
  exp: number;
}
