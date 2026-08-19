import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionaries";
import type { ProductWithRelations } from "@/types/database";
import { localized } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function ProductCard({
  product,
  locale,
  dict,
  index = 0,
}: {
  product: ProductWithRelations;
  locale: Locale;
  dict: Messages;
  index?: number;
}) {
  const name = localized(product, "name", locale);
  const brandName = product.brand?.name ?? "";

  return (
    <Reveal delay={(index % 8) * 60} className="group h-full">
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-premium"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-beige">
          {product.main_image_url ? (
            <Image
              src={product.main_image_url}
              alt={name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-contain p-6 transition-transform duration-700 ease-premium group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-charcoal/20 text-sm">
              {name}
            </div>
          )}
          <span className="absolute top-3 rtl:right-3 ltr:left-3 rounded-full bg-warmwhite/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-champagne-dark shadow-sm">
            {brandName}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-1 p-5">
          <h3 className="font-medium text-charcoal leading-snug line-clamp-2">{name}</h3>
          {product.size_label && (
            <p className="text-sm text-charcoal/50">{product.size_label}</p>
          )}
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-champagne-dark">
            {dict.common.viewProduct}
            <svg
              className="h-3.5 w-3.5 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-0.5"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
