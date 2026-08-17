import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/image-constants";

// Image storage abstraction.
//   - "local"       : writes to /public/uploads (dev / self-hosted). Does NOT
//                     persist on Vercel's ephemeral filesystem.
//   - "vercel-blob" : uploads to Vercel Blob and returns a public CDN URL.
//                     Used automatically on Vercel once a Blob store is added
//                     (which injects BLOB_READ_WRITE_TOKEN).
//
// The active driver is chosen by STORAGE_DRIVER, or auto-detected: if a Blob
// token is present we use Vercel Blob, otherwise local disk.

export { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES };

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export interface StoredImage {
  url: string;
}

function resolveDriver(): "local" | "vercel-blob" {
  const explicit = process.env.STORAGE_DRIVER?.trim();
  if (explicit === "local" || explicit === "vercel-blob") return explicit;
  return process.env.BLOB_READ_WRITE_TOKEN ? "vercel-blob" : "local";
}

/** Validate an uploaded file. Returns an error message, or null if valid. */
export function validateImage(file: File): string | null {
  if (!file || file.size === 0) return "No file was uploaded.";
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as never)) {
    return "Unsupported file type. Use JPG, PNG or WebP.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Image is too large. Maximum size is 5 MB.";
  }
  return null;
}

export async function saveImage(file: File): Promise<StoredImage> {
  const ext = EXT_BY_TYPE[file.type] ?? "jpg";
  const filename = `${Date.now()}-${randomUUID()}.${ext}`;
  return resolveDriver() === "vercel-blob"
    ? saveToBlob(file, filename)
    : saveLocal(file, filename);
}

async function saveToBlob(file: File, filename: string): Promise<StoredImage> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "STORAGE_DRIVER is vercel-blob but BLOB_READ_WRITE_TOKEN is not set. Add a Blob store in the Vercel dashboard.",
    );
  }
  const { url } = await put(`products/${filename}`, file, {
    access: "public",
    contentType: file.type,
  });
  return { url };
}

async function saveLocal(file: File, filename: string): Promise<StoredImage> {
  const dir = join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(join(dir, filename), bytes);
  return { url: `/uploads/${filename}` };
}
