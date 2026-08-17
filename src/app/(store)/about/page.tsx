import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Gauge, ShieldCheck, Tags } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Sami's iPhone - a small premium store offering carefully selected, honestly rated new and used iPhones with transparent pricing.",
};

const values = [
  { icon: BadgeCheck, title: "Carefully selected", text: "Each device is hand-picked and thoroughly checked before listing." },
  { icon: Gauge, title: "Real battery health", text: "The actual battery percentage is always shown up front." },
  { icon: ShieldCheck, title: "Honest ratings", text: "A clear 1-10 condition score you can trust." },
  { icon: Tags, title: "Fair pricing", text: "Transparent PKR pricing with no hidden costs." },
];

export default function AboutPage() {
  return (
    <div className="container py-14 sm:py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          About
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          A premium iPhone store, built on trust.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Sami&apos;s iPhone is a small, personal business focused on doing one thing
          well: offering quality new and used iPhones with complete
          transparency. No inflated claims, no pressure, just honest devices,
          clearly described, at fair prices.
        </p>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2">
        {values.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.06}>
            <div className="flex h-full gap-4 rounded-3xl border border-haze-200 bg-white p-6 shadow-soft">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-ink text-white">
                <v.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold tracking-tight text-ink">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{v.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mx-auto mt-14 max-w-2xl text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-ink-soft active:scale-[0.98]"
        >
          Browse iPhones <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>
    </div>
  );
}
