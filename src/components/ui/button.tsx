import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "whatsapp";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-white hover:bg-ink-soft shadow-soft hover:shadow-lift",
  secondary:
    "bg-haze text-ink hover:bg-haze-200",
  outline:
    "border border-haze-200 bg-white text-ink hover:bg-haze",
  ghost: "text-ink hover:bg-haze",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 shadow-soft",
  whatsapp:
    "bg-whatsapp text-white hover:bg-whatsapp-dark shadow-soft hover:shadow-lift",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base h-[3.25rem]",
  icon: "h-10 w-10",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, children, disabled, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium",
          "transition-all duration-200 active:scale-[0.98]",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
