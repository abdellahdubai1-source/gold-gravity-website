"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useTransition } from "react";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionaries";
import type { Category, BrandWithCategories } from "@/types/database";
import { localized, cn } from "@/lib/utils";

export function ProductFilters({
  locale,
  dict,
  categories,
  brands,
  activeCategory,
  activeBrand,
  activeSearch,
}: {
  locale: Locale;
  dict: Messages;
  categories: Category[];
  brands: BrandWithCategories[];
  activeCategory?: string;
  activeBrand?: string;
  activeSearch?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(activeSearch ?? "");
  const [, startTransition] = useTransition();

  function updateParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  const hasFilters = activeCategory || activeBrand || activeSearch;

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParams({ q: search || undefined });
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 rtl:right-4 ltr:left-4 h-4 w-4 text-charcoal/35" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={dict.common.search}
          className="w-full rounded-full border border-charcoal/15 bg-white py-3 rtl:pr-11 rtl:pl-5 ltr:pl-11 ltr:pr-5 text-sm outline-none transition-colors focus:border-champagne"
        />
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <FilterChip
          active={!activeCategory}
          onClick={() => updateParams({ category: undefined })}
          label={dict.common.allCategories}
        />
        {categories.map((c) => (
          <FilterChip
            key={c.id}
            active={activeCategory === c.slug}
            onClick={() => updateParams({ category: c.slug })}
            label={localized(c, "name", locale)}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterChip
          active={!activeBrand}
          onClick={() => updateParams({ brand: undefined })}
          label={dict.common.allBrands}
          variant="outline"
        />
        {brands.map((b) => (
          <FilterChip
            key={b.id}
            active={activeBrand === b.slug}
            onClick={() => updateParams({ brand: b.slug })}
            label={b.name}
            variant="outline"
          />
        ))}
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setSearch("");
            router.push(pathname, { scroll: false });
          }}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-charcoal/50 hover:text-charcoal transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          {dict.products.clearFilters}
        </button>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  variant = "solid",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  variant?: "solid" | "outline";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-200",
        active
          ? variant === "solid"
            ? "border-charcoal bg-charcoal text-warmwhite"
            : "border-champagne bg-champagne/15 text-champagne-dark"
          : "border-charcoal/15 text-charcoal/60 hover:border-charcoal/30"
      )}
    >
      {label}
    </button>
  );
}
