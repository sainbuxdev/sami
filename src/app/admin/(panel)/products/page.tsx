import { getAllProducts } from "@/lib/products";
import { ProductsManager } from "@/components/admin/products-manager";

export default async function AdminProductsPage() {
  const products = await getAllProducts();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Products
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage your full iPhone inventory.
        </p>
      </div>
      <ProductsManager
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          imageUrl: p.imageUrl,
          batteryHealth: p.batteryHealth,
          condition: p.condition,
          price: p.price,
          withBox: p.withBox,
          isAvailable: p.isAvailable,
          featured: p.featured,
        }))}
      />
    </div>
  );
}
