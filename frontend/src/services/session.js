const STORAGE_KEY = "cafdata_auth";

export function getStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const session = raw ? JSON.parse(raw) : null;
    return session?.accessToken ? session : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function getAccessToken() {
  return getStoredSession()?.accessToken ?? null;
}

export function getSessionRole() {
  const role = getStoredSession()?.user?.role;
  if (typeof role === "string") return role;
  return role?.name ?? getStoredSession()?.user?.roles?.name ?? null;
}

export function saveSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasSession() {
  return Boolean(getAccessToken());
}
