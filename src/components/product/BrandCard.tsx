import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { BrandWithCategories } from "@/types/database";
import { localized } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function BrandCard({
  brand,
  locale,
  index = 0,
}: {
  brand: BrandWithCategories;
  locale: Locale;
  index?: number;
}) {
  const line = localized(brand, "brand_line", locale);

  return (
    <Reveal delay={index * 90} className="h-full">
      <Link
        href={`/${locale}/brands/${brand.slug}`}
        className="group flex h-full flex-col items-center gap-5 rounded-2xl border border-charcoal/10 bg-white p-8 sm:p-10 text-center shadow-card transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:border-champagne/50 hover:shadow-premium"
      >
        <div className="relative flex h-20 w-full items-center justify-center">
          {brand.logo_url ? (
            <Image
              src={brand.logo_url}
              alt={brand.name}
              width={160}
              height={70}
              className="max-h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="font-serif text-3xl font-bold tracking-tight text-charcoal">
              {brand.name}
            </span>
          )}
        </div>
        <div>
          <h3 className="font-serif text-xl font-semibold text-charcoal">{brand.name}</h3>
          {line && <p className="mt-1.5 text-sm text-champagne-dark">{line}</p>}
        </div>
      </Link>
    </Reveal>
  );
}
