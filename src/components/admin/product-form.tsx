"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn, formatPrice } from "@/lib/utils";
import { productSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImagesUpload } from "@/components/admin/images-upload";
import { useToast } from "@/components/ui/toast";

export interface ProductFormValues {
  name: string;
  images: string[];
  batteryHealth: number;
  condition: number;
  price: number;
  withBox: boolean;
  details: string;
  isAvailable: boolean;
  featured: boolean;
}

const EMPTY: ProductFormValues = {
  name: "",
  images: [],
  batteryHealth: 100,
  condition: 9,
  price: 0,
  withBox: true,
  details: "",
  isAvailable: true,
  featured: false,
};

export function ProductForm({
  mode,
  productId,
  initial,
}: {
  mode: "create" | "edit";
  productId?: string;
  initial?: ProductFormValues;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const base = initial ?? EMPTY;

  const [images, setImages] = React.useState<string[]>(base.images);
  const [name, setName] = React.useState(base.name);
  const [battery, setBattery] = React.useState(String(base.batteryHealth));
  const [condition, setCondition] = React.useState(base.condition);
  const [price, setPrice] = React.useState(base.price ? String(base.price) : "");
  const [withBox, setWithBox] = React.useState(base.withBox);
  const [details, setDetails] = React.useState(base.details);
  const [isAvailable, setIsAvailable] = React.useState(base.isAvailable);
  const [featured, setFeatured] = React.useState(base.featured);

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [uploading, setUploading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const priceNum = Number(price);
  const pricePreview = price && !Number.isNaN(priceNum) ? formatPrice(priceNum) : "PKR -";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const payload = {
      name,
      images,
      batteryHealth: Number(battery),
      condition,
      price: Number(price),
      withBox,
      details,
      isAvailable,
      featured,
    };

    const parsed = productSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
        if (msgs && msgs[0]) fieldErrors[key] = msgs[0];
      }
      setErrors(fieldErrors);
      toast("Please check the highlighted fields.", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        mode === "create" ? "/api/products" : `/api/products/${productId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast(data.error ?? "Unable to save product.", "error");
        setSaving(false);
        return;
      }
      toast(mode === "create" ? "Product added successfully" : "Product updated successfully", "success");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast("Unable to save product. Please try again.", "error");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr]">
      {/* Image column */}
      <div className="space-y-2">
        <Label>Product Images</Label>
        <ImagesUpload value={images} onChange={setImages} onBusyChange={setUploading} />
        {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
        <p className="text-xs text-muted">The first image is the cover shown on cards.</p>
      </div>

      {/* Fields column */}
      <div className="space-y-6">
        <Field label="Product Name" error={errors.name}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="iPhone 13"
            aria-invalid={!!errors.name}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Battery Health" error={errors.batteryHealth} hint="0 - 100">
            <div className="relative">
              <Input
                type="number"
                min={0}
                max={100}
                value={battery}
                onChange={(e) => setBattery(e.target.value)}
                placeholder="89"
                className="pr-9"
                aria-invalid={!!errors.batteryHealth}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                %
              </span>
            </div>
          </Field>

          <Field label="Price" error={errors.price} hint={pricePreview}>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                PKR
              </span>
              <Input
                type="number"
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="98000"
                className="pl-14"
                aria-invalid={!!errors.price}
              />
            </div>
          </Field>
        </div>

        <Field label="Condition" error={errors.condition} hint={`${condition}/10`}>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCondition(n)}
                aria-pressed={condition === n}
                className={cn(
                  "h-10 w-10 rounded-xl border text-sm font-medium transition-all",
                  condition === n
                    ? "border-ink bg-ink text-white shadow-soft"
                    : "border-haze-200 bg-white text-muted hover:border-ink/30 hover:text-ink",
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Details" error={errors.details}>
          <Textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={6}
            placeholder={"Face ID working perfectly.\nTrue Tone available.\nAll cameras working.\nNo repair history.\nFactory unlocked."}
            aria-invalid={!!errors.details}
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-3">
          <ToggleRow label="With Original Box" checked={withBox} onChange={setWithBox} />
          <ToggleRow label="Available" checked={isAvailable} onChange={setIsAvailable} />
          <ToggleRow label="Featured Product" checked={featured} onChange={setFeatured} />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-haze-200 pt-6 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
          <Button type="submit" loading={saving} disabled={uploading}>
            {mode === "create" ? "Add iPhone" : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {hint && <span className="text-xs font-medium text-muted">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-haze-200 bg-white px-4 py-3">
      <span className="text-sm font-medium text-ink">{label}</span>
      <Switch checked={checked} onChange={onChange} label={label} />
    </div>
  );
}
