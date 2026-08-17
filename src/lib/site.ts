// Resolve the canonical site URL for metadata / SEO in a way that never throws,
// even when NEXT_PUBLIC_SITE_URL is unset OR set to an empty string (a common
// Vercel misconfiguration that breaks `new URL(...)` during the build).

function normalize(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    // Accept values with or without a protocol.
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  return (
    normalize(process.env.NEXT_PUBLIC_SITE_URL ?? "") ??
    normalize(process.env.VERCEL_URL ?? "") ?? // Vercel provides this automatically
    "http://localhost:3000"
  );
}

/** A guaranteed-valid URL for `metadataBase` (never throws, even on misconfig). */
export function getMetadataBase(): URL {
  try {
    return new URL(getSiteUrl());
  } catch {
    return new URL("http://localhost:3000");
  }
}
