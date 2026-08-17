import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BatteryMedium, Star, Package, ShieldCheck } from "lucide-react";
import { ProductGallery } from "@/components/product/product-gallery";
import { WhatsAppButton } from "@/components/product/whatsapp-button";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug } from "@/lib/products";
import { parseImages } from "@/lib/images";
import { getSettings } from "@/lib/settings";
import { formatPrice, formatBattery, formatCondition } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "iPhone Not Found" };

  const title = product.name;
  const description = `${product.name} - ${formatBattery(product.batteryHealth)} battery, ${formatCondition(product.condition)} condition, ${formatPrice(product.price)}. ${product.withBox ? "With original box. " : ""}Buy directly via WhatsApp.`;

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${title} | Sami's iPhone`,
      description,
      type: "website",
      images: [{ url: product.imageUrl, alt: `${product.name} - Sami's iPhone` }],
    },
  };
}

function SpecRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-haze-200 py-4 last:border-0">
      <span className="flex items-center gap-2.5 text-sm text-muted">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="text-sm font-semibold text-ink">{value}</span>
    </div>
  );
}

export default async function ProductDetailsPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSettings(),
  ]);

  if (!product) notFound();

  const sold = !product.isAvailable;

  return (
    <div className="container py-8 sm:py-12">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to iPhones
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <ProductGallery images={parseImages(product)} name={product.name} sold={sold} />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="muted">{formatCondition(product.condition)} Condition</Badge>
            {product.withBox && <Badge tone="success">With Box</Badge>}
            {sold ? (
              <Badge tone="danger">Sold</Badge>
            ) : (
              <Badge tone="accent">Available</Badge>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            {formatPrice(product.price)}
          </p>

          <div className="mt-8 rounded-3xl border border-haze-200 bg-white px-5">
            <SpecRow icon={BatteryMedium} label="Battery Health" value={formatBattery(product.batteryHealth)} />
            <SpecRow icon={Star} label="Condition" value={formatCondition(product.condition)} />
            <SpecRow icon={Package} label="With Box" value={product.withBox ? "Yes" : "No"} />
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Details
            </h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/90">
              {product.details}
            </p>
          </div>

          <div className="mt-8 lg:mt-auto lg:pt-8">
            <WhatsAppButton
              whatsappNumber={settings.whatsappNumber}
              product={product}
              available={!sold}
              className="w-full sm:w-auto"
            />
            {!sold && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Your message to Sami is pre-filled with all the details.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
