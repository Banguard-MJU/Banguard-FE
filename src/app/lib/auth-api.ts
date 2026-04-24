import { apiRequest, clearAuthTokens, setAuthTokens, type AuthTokens } from "./api";

export interface AvailabilityResponse {
  available: boolean;
  message?: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  name: string;
  nickname: string;
}

export interface AuthApiUser {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  isAdmin?: boolean;
  createdAt: string;
}

interface BackendUserResponse {
  user_id: number;
  email: string;
  nickname: string;
  role?: string;
  created_at?: string;
}

interface TokenResponse extends AuthTokens {
  access_token: string;
}

export interface AuthApiResponse {
  success: boolean;
  message?: string;
  user: AuthApiUser;
}

function normalizeBackendUser(user: BackendUserResponse, nameFallback?: string): AuthApiUser {
  return {
    id: String(user.user_id),
    email: user.email,
    name: nameFallback?.trim() || user.nickname,
    nickname: user.nickname,
    isAdmin: user.role === "ADMIN",
    createdAt: user.created_at || new Date().toISOString(),
  };
}

export async function checkEmailAvailability(email: string) {
  return apiRequest<AvailabilityResponse>("/auth/check-email", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function checkNicknameAvailability(nickname: string) {
  return apiRequest<AvailabilityResponse>("/auth/check-nickname", {
    method: "POST",
    body: JSON.stringify({ nickname }),
  });
}

export async function getCurrentUserFromBackend() {
  const user = await apiRequest<BackendUserResponse>("/auth/me", { auth: true });
  return normalizeBackendUser(user);
}

export async function loginWithBackend(email: string, password: string): Promise<AuthApiResponse> {
  const tokens = await apiRequest<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  setAuthTokens(tokens);

  try {
    const user = await getCurrentUserFromBackend();
    return { success: true, user };
  } catch (error) {
    clearAuthTokens();
    throw error;
  }
}

export async function signupWithBackend(payload: SignupPayload): Promise<AuthApiResponse> {
  await apiRequest<BackendUserResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      nickname: payload.nickname,
    }),
  });

  const result = await loginWithBackend(payload.email, payload.password);
  return {
    ...result,
    user: {
      ...result.user,
      name: payload.name,
    },
  };
}
