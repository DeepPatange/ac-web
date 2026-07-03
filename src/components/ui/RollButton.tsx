import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Vertical text-roll: reveals the duplicated copy on group-hover by sliding the
 *  stack up one line (-50%). Place inside a `group` element. */
export function TextRoll({ text }: { text: string }) {
  return (
    <span className="block h-[20px] overflow-hidden">
      <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
        <span className="flex h-[20px] items-center whitespace-nowrap">{text}</span>
        <span className="flex h-[20px] items-center whitespace-nowrap">{text}</span>
      </span>
    </span>
  );
}

type Variant = "solid" | "outline";

/**
 * Agency-style pill CTA: rolling label + an arrow that sits in a circle and
 * rotates -45° on hover. `solid` = brand red fill; `outline` = hairline on dark.
 */
export default function RollButton({
  href,
  label,
  variant = "solid",
  className,
}: {
  href: string;
  label: string;
  variant?: Variant;
  className?: string;
}) {
  const solid = variant === "solid";
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 self-start rounded-full py-2 pl-5 pr-2 text-[14px] font-medium transition-colors duration-300",
        solid
          ? "bg-accord-red text-white hover:bg-accord-redDark"
          : "border border-white/15 text-white hover:border-white/40 hover:bg-white/[0.04]",
        className
      )}
    >
      <TextRoll text={label} />
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          solid ? "bg-white" : "bg-white/10"
        )}
      >
        <ArrowRight
          size={16}
          className={cn(
            "transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45",
            solid ? "text-accord-red" : "text-white"
          )}
        />
      </span>
    </Link>
  );
}
