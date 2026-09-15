import { request } from "./apiClient.js";
import { clearSession, saveSession } from "./session.js";

export { clearSession, getStoredSession, hasSession } from "./session.js";

export async function login(credentials) {
  const response = await request("/auth/login", {
    method: "POST",
    body: credentials,
  });
  const session = {
    accessToken: response.access_token,
    user: response.user,
  };
  saveSession(session);
  return session;
}

export function logout() {
  clearSession();
}
