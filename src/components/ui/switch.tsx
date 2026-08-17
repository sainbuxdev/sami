"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
  label?: string;
}

/** Accessible toggle switch (used for With Box / Availability / Featured). */
export function Switch({ checked, onChange, id, disabled, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2",
        "disabled:opacity-50",
        checked ? "bg-ink" : "bg-haze-200",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}
