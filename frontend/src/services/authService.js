import { ENV } from "../config/env";
import { request } from "./apiClient";

const STORAGE_KEY = "cafdata_auth";

export function getStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function login(credentials) {
  if (ENV.ENABLE_MOCK_AUTH) {
    return {
      token: "mock-token",
      user: { name: "Admin", role: "admin", email: credentials.email },
    };
  }

  return request("/auth/login", {
    method: "POST",
    body: credentials,
  });
}
