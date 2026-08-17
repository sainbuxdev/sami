"use client";

import * as React from "react";
import Image from "next/image";
import { UploadCloud, Loader2, X, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/image-constants";

const MAX_IMAGES = 8;

/**
 * Manages an ordered list of product images. The first image is the cover.
 * Supports multi-file upload, drag-and-drop, remove, reorder, and set-as-cover.
 */
export function ImagesUpload({
  value,
  onChange,
  onBusyChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const setBusy = (b: boolean) => {
    setUploading(b);
    onBusyChange?.(b);
  };

  async function uploadOne(file: File): Promise<string | null> {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as never)) {
      toast(`"${file.name}" is an unsupported type. Use JPG, PNG or WebP.`, "error");
      return null;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast(`"${file.name}" is too large. Maximum size is 5 MB.`, "error");
      return null;
    }
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast(data.error ?? "Upload failed.", "error");
      return null;
    }
    return data.url as string;
  }

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files);
    const room = MAX_IMAGES - value.length;
    if (room <= 0) {
      toast(`You can add up to ${MAX_IMAGES} images.`, "error");
      return;
    }
    const toUpload = list.slice(0, room);
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const file of toUpload) {
        const url = await uploadOne(file);
        if (url) urls.push(url);
      }
      if (urls.length) {
        onChange([...value, ...urls]);
        toast(urls.length > 1 ? `${urls.length} images uploaded` : "Image uploaded", "success");
      }
    } finally {
      setBusy(false);
    }
  }

  function removeAt(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  }
  function makeCover(i: number) {
    if (i === 0) return;
    const next = [...value];
    const [item] = next.splice(i, 1);
    next.unshift(item!);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5">
          {value.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-gradient-to-b from-haze to-white",
                i === 0 ? "border-ink" : "border-haze-200",
              )}
            >
              <div className="relative aspect-square">
                <Image src={url} alt={`Product image ${i + 1}`} fill className="object-contain p-2" sizes="120px" />
              </div>
              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold text-white">
                  <Star className="h-2.5 w-2.5 fill-white" /> Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Remove image"
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-sm transition-colors hover:bg-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-white/85 px-1.5 py-1 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move left"
                  className="text-muted disabled:opacity-30 hover:text-ink"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => makeCover(i)}
                  disabled={i === 0}
                  className="text-[10px] font-medium text-muted disabled:opacity-30 hover:text-ink"
                >
                  Set cover
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  aria-label="Move right"
                  className="text-muted disabled:opacity-30 hover:text-ink"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length < MAX_IMAGES && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed p-6 text-center transition-colors",
            dragging ? "border-ink bg-haze" : "border-haze-200 bg-haze/40 hover:bg-haze",
            value.length > 0 ? "py-5" : "aspect-[4/3]",
          )}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-soft">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-ink" />
            ) : (
              <UploadCloud className="h-5 w-5 text-ink" />
            )}
          </span>
          <span className="text-sm font-medium text-ink">
            {uploading ? "Uploading..." : value.length ? "Add more images" : "Upload Product Images"}
          </span>
          <span className="text-xs text-muted">
            Drag &amp; drop or browse. JPG, PNG, WebP. Up to {MAX_IMAGES} images, 5 MB each.
          </span>
        </button>
      )}
    </div>
  );
}
