import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>
      <h1 className="mb-8 mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        Add iPhone
      </h1>
      <ProductForm mode="create" />
    </div>
  );
}
