import Link from "next/link";
import { Smartphone, MessageCircle, Lock } from "lucide-react";
import { generateWhatsAppUrl } from "@/lib/whatsapp";
import { NexoraLogo } from "@/components/layout/nexora-logo";

export function Footer({
  storeName,
  whatsappNumber,
  description,
}: {
  storeName: string;
  whatsappNumber: string;
  description: string;
}) {
  const year = new Date().getFullYear();
  const waUrl = generateWhatsAppUrl(
    whatsappNumber,
    `Assalamualaikum ${storeName}, I have a question.`,
  );

  return (
    <footer className="mt-24 border-t border-haze-200 bg-haze/40">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink text-white">
              <Smartphone className="h-4 w-4" />
            </span>
            {storeName}
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {description}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/" className="text-ink/80 transition-colors hover:text-ink">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-ink/80 transition-colors hover:text-ink">
                iPhones
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-ink/80 transition-colors hover:text-ink">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-ink/80 transition-colors hover:text-ink">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Contact
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ink/80 transition-colors hover:text-whatsapp-dark"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </li>
            <li>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-ink/80 transition-colors hover:text-ink"
              >
                <Lock className="h-4 w-4" />
                Store Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-haze-200">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
          <p>© {year} {storeName}. All rights reserved.</p>
          <span className="inline-flex items-center gap-2">
            <span>Developed by</span>
            <NexoraLogo />
          </span>
        </div>
      </div>
    </footer>
  );
}
