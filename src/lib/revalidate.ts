import { revalidatePath } from "next/cache";

/** Revalidate all pages affected by a product change. */
export function revalidateProduct(slug?: string) {
  revalidatePath("/");
  revalidatePath("/products");
  if (slug) revalidatePath(`/products/${slug}`);
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/products");
  revalidatePath("/admin/featured");
}
