import { ENV } from "../config/env.js";
import { clearSession, getAccessToken } from "./session.js";

export class ApiError extends Error {
  constructor(message, status = 0, payload = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function buildHeaders(body, extraHeaders = {}) {
  const token = getAccessToken();

  return {
    ...(body !== undefined && !(body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

export async function request(path, options = {}) {
  const { method = "GET", body, headers } = options;
  let response;

  try {
    response = await fetch(`${ENV.API_BASE_URL}${path}`, {
      method,
      headers: buildHeaders(body, headers),
      body:
        body === undefined || body instanceof FormData
          ? body
          : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor.");
  }

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");

  let payload = null;
  try {
    payload = isJson ? await response.json() : await response.text();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    const apiMessage = isJson ? payload?.message : null;
    const message = Array.isArray(apiMessage)
      ? apiMessage.join(", ")
      : apiMessage ||
        (response.status === 403
          ? "No tienes permiso para realizar esta acción."
          : "No se pudo completar la solicitud.");
    throw new ApiError(message, response.status, payload);
  }

  return payload;
}
