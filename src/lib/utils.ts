import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a whole-number PKR price as "PKR 98,000". */
export function formatPrice(price: number): string {
  return `PKR ${new Intl.NumberFormat("en-US").format(price)}`;
}

/** Format battery health integer as "89%". */
export function formatBattery(batteryHealth: number): string {
  return `${batteryHealth}%`;
}

/** Format condition integer as "9/10". */
export function formatCondition(condition: number): string {
  return `${condition}/10`;
}

/** Turn a product name into a URL-safe slug fragment. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Short random suffix to guarantee unique slugs for duplicate names. */
export function randomSuffix(length = 5): string {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length);
}

/** Time-of-day greeting for the admin dashboard. */
export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
