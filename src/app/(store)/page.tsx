import Link from "next/link";
import { ArrowRight, BadgeCheck, Gauge, Tags, ShieldCheck, MessageCircle } from "lucide-react";
import { Hero } from "@/components/layout/hero";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/animations/reveal";
import { getFeaturedProducts } from "@/lib/products";

// Render at request time so the store reflects the live database (e.g. right
// after seeding a fresh deployment) instead of a build-time snapshot.
export const dynamic = "force-dynamic";

const trustPoints = [
  { icon: BadgeCheck, title: "Carefully Selected Devices", text: "Every iPhone is hand-picked and inspected before it reaches the store." },
  { icon: Gauge, title: "Real Battery Health", text: "Actual battery percentage shown up front - no surprises later." },
  { icon: ShieldCheck, title: "Honest Condition Ratings", text: "A transparent 1-10 rating so you know exactly what you're getting." },
  { icon: Tags, title: "Transparent Pricing", text: "Clear PKR pricing with no hidden fees or negotiation games." },
  { icon: MessageCircle, title: "Direct WhatsApp Support", text: "Talk to Sami directly. One tap to ask questions or buy." },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);
  const heroImage = featured[0]?.imageUrl ?? "/demo/iphone-15.svg";
  const heroAlt = featured[0]
    ? `${featured[0].name} - Sami's iPhone`
    : "Premium iPhone - Sami's iPhone";

  return (
    <>
      <Hero heroImage={heroImage} heroAlt={heroAlt} />

      {/* Trust section */}
      <section className="container py-16 sm:py-20">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Why Sami&apos;s iPhone?
          </h2>
          <p className="mt-3 text-muted">
            A premium buying experience built on trust and transparency.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trustPoints.map((point, i) => (
            <Reveal key={point.title} delay={i * 0.06}>
              <div className="h-full rounded-3xl border border-haze-200 bg-white p-6 shadow-soft transition-shadow hover:shadow-lift">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white">
                  <point.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-ink">
                  {point.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{point.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="container py-6 sm:py-10">
          <Reveal className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Featured iPhones
              </h2>
              <p className="mt-2 text-muted">Sami&apos;s current top picks.</p>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-ink sm:inline-flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="container py-16 sm:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl bg-ink px-6 py-14 text-center text-white sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(60%_60%_at_50%_0%,rgba(99,102,241,0.5),transparent_70%)]" />
            <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">
              Find your next iPhone.
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-white/70">
              Browse the current collection and buy directly through WhatsApp.
            </p>
            <Link
              href="/products"
              className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-ink transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore iPhones <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
