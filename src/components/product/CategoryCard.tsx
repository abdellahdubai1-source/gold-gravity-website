import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Category } from "@/types/database";
import { localized } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function CategoryCard({
  category,
  locale,
  index = 0,
}: {
  category: Category;
  locale: Locale;
  index?: number;
}) {
  const name = localized(category, "name", locale);

  return (
    <Reveal delay={index * 80} className="h-full">
      <Link
        href={`/${locale}/products/category/${category.slug}`}
        className="group relative flex h-64 sm:h-72 flex-col justify-end overflow-hidden rounded-2xl shadow-card transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-premium"
      >
        {category.image_url && (
          <Image
            src={category.image_url}
            alt={name}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />
        <div className="relative p-5 sm:p-6">
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-warmwhite leading-snug">
            {name}
          </h3>
          <span className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-champagne/90 text-charcoal opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <svg className="h-4 w-4 rtl:rotate-180" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
