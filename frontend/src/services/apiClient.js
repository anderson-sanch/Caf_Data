import { ENV } from "../config/env";

function buildHeaders(token, extraHeaders = {}) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

export async function request(path, options = {}) {
  const { method = "GET", body, token, headers } = options;

  const response = await fetch(`${ENV.API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(token, headers),
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");

  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (isJson && payload?.message) || "No se pudo completar la solicitud.";
    throw new Error(message);
  }

  return payload;
}
