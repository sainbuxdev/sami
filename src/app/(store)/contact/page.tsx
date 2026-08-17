import type { Metadata } from "next";
import { MessageCircle, Clock, MapPin } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { getSettings } from "@/lib/settings";
import { generateWhatsAppUrl, normalizePhone } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Sami directly on WhatsApp to ask about any iPhone or arrange a purchase.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const waUrl = generateWhatsAppUrl(
    settings.whatsappNumber,
    `Assalamualaikum ${settings.storeName}, I have a question.`,
  );
  const prettyNumber = `+${normalizePhone(settings.whatsappNumber)}`;

  return (
    <div className="container py-14 sm:py-20">
      <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Contact
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Let&apos;s talk on WhatsApp.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            The fastest way to reach {settings.storeName} is directly on WhatsApp.
            Ask about any device, check availability, or arrange a meetup - Sami
            replies personally.
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-medium text-white shadow-soft transition-all hover:bg-whatsapp-dark hover:shadow-lift active:scale-[0.98]"
          >
            <MessageCircle className="h-5 w-5" />
            Chat on WhatsApp
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-3 rounded-3xl border border-haze-200 bg-white p-6 shadow-soft sm:p-8">
            <InfoRow icon={MessageCircle} label="WhatsApp" value={prettyNumber} />
            <InfoRow icon={Clock} label="Hours" value="Every day · 10:00 - 22:00" />
            <InfoRow icon={MapPin} label="Delivery" value="Meetup & nationwide delivery" />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-haze/50 px-4 py-3.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-ink shadow-sm">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className="text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}
