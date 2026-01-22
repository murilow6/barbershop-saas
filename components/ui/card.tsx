import * as React from "react";
import { cn } from "@/lib/cn";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-xl",
        className
      )}
      {...props}
    />
  );
}
