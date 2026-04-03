export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  // Por defecto el frontend funciona sin backend.
  ENABLE_MOCK_AUTH: import.meta.env.VITE_ENABLE_MOCK_AUTH !== "false",
};
