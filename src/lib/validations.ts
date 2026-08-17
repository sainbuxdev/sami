import { z } from "zod";

/** Shared server + client validation for product create/update. */
export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required")
    .max(80, "Name is too long"),
  images: z
    .array(z.string().trim().min(1))
    .min(1, "At least one product image is required")
    .max(8, "You can add up to 8 images"),
  batteryHealth: z.coerce
    .number({ invalid_type_error: "Battery health must be a number" })
    .int("Use a whole number")
    .min(0, "Minimum is 0%")
    .max(100, "Maximum is 100%"),
  condition: z.coerce
    .number({ invalid_type_error: "Condition must be a number" })
    .int("Use a whole number")
    .min(1, "Minimum is 1")
    .max(10, "Maximum is 10"),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .int("Use a whole number")
    .positive("Price must be greater than 0")
    .max(100_000_000, "Price is too large"),
  withBox: z.coerce.boolean(),
  details: z
    .string()
    .trim()
    .min(1, "Details are required")
    .max(2000, "Details are too long"),
  isAvailable: z.coerce.boolean(),
  featured: z.coerce.boolean(),
});

export type ProductInput = z.infer<typeof productSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const settingsSchema = z.object({
  storeName: z.string().trim().min(1, "Store name is required").max(60),
  whatsappNumber: z
    .string()
    .trim()
    .min(8, "Enter a valid WhatsApp number")
    .max(20, "Number is too long")
    .regex(/^\+?[0-9\s-]+$/, "Only digits, spaces, + and - are allowed"),
  storeDescription: z.string().trim().max(200).optional().default(""),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
