import type React from "react";

import { cn } from "@/lib/utils";

export default function PageBackground({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100",
        className
      )}
    >
      {children}
    </div>
  );
}
