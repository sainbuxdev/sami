import { prisma } from "@/lib/db";
import type { StoreSettings } from "@/types";

const FALLBACK: StoreSettings = {
  storeName: "Sami's iPhone",
  whatsappNumber: process.env.WHATSAPP_NUMBER ?? "923001234567",
  storeDescription: "Premium iPhones. Simple. Transparent. Trusted.",
};

/**
 * Read store settings from the single settings row, falling back to sensible
 * defaults (and the WHATSAPP_NUMBER env var) if the row is missing.
 * This is why the WhatsApp number is never hardcoded across the app.
 */
export async function getSettings(): Promise<StoreSettings> {
  try {
    const row = await prisma.settings.findUnique({ where: { id: "store" } });
    if (!row) return FALLBACK;
    return {
      storeName: row.storeName,
      whatsappNumber: row.whatsappNumber,
      storeDescription: row.storeDescription,
    };
  } catch {
    return FALLBACK;
  }
}
