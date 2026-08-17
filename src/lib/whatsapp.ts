import type { Product } from "@/types";
import { formatBattery, formatCondition, formatPrice } from "@/lib/utils";

/**
 * Normalize a phone number into WhatsApp's expected international format:
 * digits only, no leading "+", no spaces or punctuation.
 * e.g. "+92 300 1234567" -> "923001234567".
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

/**
 * Build the pre-filled WhatsApp message for a product enquiry.
 * The customer never needs to type or copy anything.
 */
export function generateWhatsAppMessage(
  product: Pick<
    Product,
    "name" | "batteryHealth" | "condition" | "withBox" | "price" | "details"
  >,
): string {
  return [
    "Assalamualaikum Sami,",
    "",
    "I'm interested in this iPhone:",
    "",
    `📱 Product: ${product.name}`,
    `🔋 Battery Health: ${formatBattery(product.batteryHealth)}`,
    `⭐ Condition: ${formatCondition(product.condition)}`,
    `📦 With Box: ${product.withBox ? "Yes" : "No"}`,
    `💰 Price: ${formatPrice(product.price)}`,
    "",
    "Details:",
    product.details.trim(),
    "",
    "I would like to know more about this product.",
  ].join("\n");
}

/**
 * Build a WhatsApp click-to-chat URL.
 * Uses wa.me, which routes to the app on mobile and WhatsApp Web on desktop.
 */
export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  const number = normalizePhone(phoneNumber);
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${text}`;
}

/** Convenience: full URL for a product enquiry in one call. */
export function productWhatsAppUrl(
  phoneNumber: string,
  product: Parameters<typeof generateWhatsAppMessage>[0],
): string {
  return generateWhatsAppUrl(phoneNumber, generateWhatsAppMessage(product));
}
