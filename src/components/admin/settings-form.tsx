"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { settingsSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { normalizePhone } from "@/lib/whatsapp";

export function SettingsForm({
  initial,
}: {
  initial: { storeName: string; whatsappNumber: string; storeDescription: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [storeName, setStoreName] = React.useState(initial.storeName);
  const [whatsappNumber, setWhatsappNumber] = React.useState(initial.whatsappNumber);
  const [storeDescription, setStoreDescription] = React.useState(initial.storeDescription);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);

  const normalized = normalizePhone(whatsappNumber);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const parsed = settingsSchema.safeParse({ storeName, whatsappNumber, storeDescription });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
        if (msgs && msgs[0]) fieldErrors[key] = msgs[0];
      }
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast(data.error ?? "Unable to save settings.", "error");
      } else {
        toast("Settings saved successfully", "success");
        router.refresh();
      }
    } catch {
      toast("Unable to save settings. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="storeName">Store Name</Label>
        <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
        {errors.storeName && <p className="text-sm text-red-600">{errors.storeName}</p>}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
          <span className="text-xs font-medium text-muted">
            {normalized ? `wa.me/${normalized}` : "International format"}
          </span>
        </div>
        <Input
          id="whatsappNumber"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          placeholder="+92 300 1234567"
          inputMode="tel"
        />
        <p className="text-xs text-muted">
          Used for every &ldquo;Buy on WhatsApp&rdquo; button. Include the country code.
        </p>
        {errors.whatsappNumber && <p className="text-sm text-red-600">{errors.whatsappNumber}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="storeDescription">Store Description</Label>
        <Textarea
          id="storeDescription"
          value={storeDescription}
          onChange={(e) => setStoreDescription(e.target.value)}
          rows={3}
          placeholder="Premium iPhones. Simple. Transparent. Trusted."
        />
        {errors.storeDescription && <p className="text-sm text-red-600">{errors.storeDescription}</p>}
      </div>

      <div className="border-t border-haze-200 pt-6">
        <Button type="submit" loading={saving}>
          Save Settings
        </Button>
      </div>
    </form>
  );
}
