import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { getProductById } from "@/lib/products";
import { parseImages } from "@/lib/images";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>
      <h1 className="mb-8 mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        Edit {product.name}
      </h1>
      <ProductForm
        mode="edit"
        productId={product.id}
        initial={{
          name: product.name,
          images: parseImages(product),
          batteryHealth: product.batteryHealth,
          condition: product.condition,
          price: product.price,
          withBox: product.withBox,
          details: product.details,
          isAvailable: product.isAvailable,
          featured: product.featured,
        }}
      />
    </div>
  );
}
