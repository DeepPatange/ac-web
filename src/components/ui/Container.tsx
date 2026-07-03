import { cn } from "@/lib/utils";
import { ElementType, ReactNode } from "react";

/** Centered max-width content wrapper with responsive gutters. */
export default function Container({
  as: As = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <As className={cn("mx-auto w-full max-w-container px-5 sm:px-8", className)}>
      {children}
    </As>
  );
}
