// Helpers for the product image gallery, which is stored as a JSON-encoded
// string array in the `images` column (SQLite-safe; upgrade to a Json column
// on Postgres later without touching callers).

export function parseImages(product: {
  images?: string | null;
  imageUrl: string;
}): string[] {
  if (product.images) {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed)) {
        const urls = parsed.filter(
          (u): u is string => typeof u === "string" && u.length > 0,
        );
        if (urls.length > 0) return urls;
      }
    } catch {
      // fall through to cover-only
    }
  }
  return product.imageUrl ? [product.imageUrl] : [];
}

export function serializeImages(urls: string[]): string {
  return JSON.stringify(urls.filter((u) => typeof u === "string" && u.length > 0));
}
