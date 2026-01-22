import * as React from "react";
import { cn } from "@/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input = React.forwardRef<HTMLInputElement, Props>(function Input(
  { className, label, id, ...props },
  ref
) {
  const autoId = React.useId();
  const inputId = id || autoId;

  const field = (
    <input
      ref={ref}
      id={inputId}
      className={cn(
        "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-white/30",
        "focus:border-gold/70 focus:ring-2 focus:ring-gold/20 outline-none",
        className
      )}
      {...props}
    />
  );

  if (!label) return field;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-sm text-neutral-200">
        {label}
      </label>
      {field}
    </div>
  );
});
