import { apiRequest, clearAuthTokens, getAccessToken, setAuthTokens, type AuthTokens } from "./api";

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
  profile_img?: string | null;
  created_at?: string;
  role?: string;
}

interface TokenResponse extends AuthTokens {
  access_token: string;
  refresh_token: string;
}

interface UpdateMeResponse {
  user_id: number;
  nickname: string;
  profile_img?: string | null;
  updated_at: string;
}

export interface AuthApiResponse {
  success: boolean;
  message?: string;
  user: AuthApiUser;
}

interface VerificationResponse {
  message?: string;
  detail?: string;
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

export async function sendEmailVerification(email: string) {
  return apiRequest<VerificationResponse>("/auth/send-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resendEmailVerification(email: string) {
  return apiRequest<VerificationResponse>("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function confirmEmailVerification(token: string) {
  const query = new URLSearchParams({ token }).toString();
  return apiRequest<VerificationResponse>(`/auth/verify-email?${query}`);
}

export async function updateMeWithBackend(payload: {
  nickname?: string;
  password?: string;
  profileImg?: string | null;
}): Promise<UpdateMeResponse> {
  return apiRequest<UpdateMeResponse>("/auth/me", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({
      nickname: payload.nickname,
      password: payload.password,
      profile_img: payload.profileImg,
    }),
  });
}

export async function logoutFromBackend() {
  if (!getAccessToken()) {
    return;
  }

  await apiRequest<null>("/auth/logout", {
    method: "POST",
    auth: true,
  });
}

export async function deleteMeFromBackend() {
  await apiRequest<null>("/auth/me", {
    method: "DELETE",
    auth: true,
  });
}
