import { prisma } from "@/lib/db";
import { ProductsManager } from "@/components/admin/products-manager";

export default async function FeaturedPage() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Featured
        </h1>
        <p className="mt-1 text-sm text-muted">
          These iPhones appear in the Featured section on the homepage.
        </p>
      </div>
      <ProductsManager
        showAddButton={false}
        emptyState={{
          title: "No featured iPhones yet.",
          message: "Mark a product as featured from the Products page to showcase it on the homepage.",
          actionHref: "/admin/products",
          actionLabel: "Go to Products",
        }}
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
