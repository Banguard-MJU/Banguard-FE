import { normalizeErrorMessage } from "./error-message";

const AZURE_API_BASE_URL = "https://banguard-api.azurewebsites.net/api";

function getDefaultApiBaseUrl() {
  if (typeof window === "undefined") {
    return "/api";
  }

  const hostname = window.location.hostname;
  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";
  return isLocalHost ? "/api" : AZURE_API_BASE_URL;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || getDefaultApiBaseUrl()).replace(/\/+$/, "");

const ACCESS_TOKEN_STORAGE_KEY = "banguard_access_token";
const REFRESH_TOKEN_STORAGE_KEY = "banguard_refresh_token";

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
  token?: string | null;
};

export interface AuthTokens {
  access_token: string;
  refresh_token?: string | null;
  token_type?: string;
}

export function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function getErrorMessage(data: unknown) {
  if (typeof data !== "object" || data === null) {
    return undefined;
  }

  const record = data as Record<string, unknown>;
  if (typeof record.message === "string") {
    return record.message;
  }
  if (typeof record.detail === "string") {
    return record.detail;
  }
  if (Array.isArray(record.detail)) {
    return record.detail
      .map((item) => {
        if (typeof item === "object" && item !== null && "msg" in item) {
          return String((item as { msg: unknown }).msg);
        }
        return String(item);
      })
      .join("\n");
  }

  return undefined;
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function setAuthTokens(tokens: AuthTokens) {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.access_token);

  if (tokens.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refresh_token);
  }
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { auth = false, token, headers, body, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);

  if (body && !(body instanceof FormData) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  const authToken = token ?? (auth ? getAccessToken() : null);
  if (authToken) {
    requestHeaders.set("Authorization", `Bearer ${authToken}`);
  }

  let response: Response;
  try {
    response = await fetch(buildApiUrl(path), {
      ...requestOptions,
      headers: requestHeaders,
      body,
    });
  } catch (error) {
    throw new Error(normalizeErrorMessage(error instanceof Error ? error.message : undefined));
  }

  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { detail: text };
  }

  if (!response.ok) {
    throw new Error(normalizeErrorMessage(getErrorMessage(data)));
  }

  return data as T;
}
