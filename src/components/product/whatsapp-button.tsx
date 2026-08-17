"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { productWhatsAppUrl } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  whatsappNumber: string;
  product: {
    name: string;
    batteryHealth: number;
    condition: number;
    withBox: boolean;
    price: number;
    details: string;
  };
  available: boolean;
  className?: string;
}

export function WhatsAppButton({
  whatsappNumber,
  product,
  available,
  className,
}: WhatsAppButtonProps) {
  const { toast } = useToast();

  if (!available) {
    return (
      <Button
        type="button"
        variant="secondary"
        size="lg"
        disabled
        className={className}
      >
        Currently Unavailable
      </Button>
    );
  }

  const url = productWhatsAppUrl(whatsappNumber, product);

  return (
    <Button
      variant="whatsapp"
      size="lg"
      className={className}
      onClick={() => {
        toast("Opening WhatsApp...", "info");
        window.open(url, "_blank", "noopener,noreferrer");
      }}
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      Buy on WhatsApp
    </Button>
  );
}
