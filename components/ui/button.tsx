import * as React from "react";
import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

export function Button({ variant = "primary", size = "md", className, ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-400/40 disabled:opacity-50 disabled:pointer-events-none";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const primary =
    "btn3d bg-gold text-black hover:-translate-y-0.5 active:translate-y-0";
  const secondary =
    "btn3d bg-wood text-sand border border-white/10 hover:border-gold/40";
  const ghost = "bg-transparent text-sand hover:bg-white/5";
  const outline = "border border-stone-700 bg-transparent text-stone-200 hover:bg-stone-800";

  const variantStyle = variant === "secondary" ? secondary : variant === "ghost" ? ghost : variant === "outline" ? outline : primary;

  return <button className={cn(base, sizes[size], variantStyle, className)} {...props} />;
}
