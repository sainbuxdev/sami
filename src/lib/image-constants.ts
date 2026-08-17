// Client-safe image constraints (no Node APIs), shared by the browser upload
// widget and the server-side storage validator.

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
