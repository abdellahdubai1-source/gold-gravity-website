import { PackageSearch } from "lucide-react";
import { Button } from "./Button";

export function EmptyState({
  heading,
  text,
  ctaLabel,
  ctaHref,
}: {
  heading: string;
  text: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-charcoal/15 bg-beige/40 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-champagne/15 text-champagne-dark">
        <PackageSearch className="h-6 w-6" />
      </div>
      <h3 className="mt-5 font-serif text-xl font-semibold text-charcoal">{heading}</h3>
      <p className="mt-2 max-w-sm text-sm text-charcoal/55">{text}</p>
      {ctaLabel && ctaHref && (
        <Button href={ctaHref} variant="outline" className="mt-6">
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
