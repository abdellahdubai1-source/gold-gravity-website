import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  heading,
  subtext,
  align = "start",
  className,
}: {
  eyebrow?: string;
  heading: string;
  subtext?: string;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-champagne-dark">
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-charcoal text-balance gold-underline pb-4",
          align === "center" && "mx-auto"
        )}
      >
        {heading}
      </h2>
      {subtext && (
        <p className="mt-5 text-base sm:text-lg leading-relaxed text-charcoal/60">
          {subtext}
        </p>
      )}
    </Reveal>
  );
}
