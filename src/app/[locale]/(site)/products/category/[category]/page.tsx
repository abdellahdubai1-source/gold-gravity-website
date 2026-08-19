import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCategoryBySlug, getProducts, getCategories, getBrands } from "@/lib/data/queries";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";
import { localized } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; category: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  if (!category) return { title: "Category Not Found" };
  const title =
    (params.locale === "ar" ? category.seo_title_ar : category.seo_title_en) ??
    `${localized(category, "name", params.locale)} | Gold Gravity Products`;
  const description =
    (params.locale === "ar" ? category.seo_description_ar : category.seo_description_en) ??
    localized(category, "description", params.locale) ??
    undefined;
  return { title, description };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { locale: Locale; category: string };
  searchParams: { brand?: string; q?: string };
}) {
  const { locale, category: categorySlug } = params;
  const dict = getDictionary(locale);

  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const [products, categories, brands] = await Promise.all([
    getProducts({ categorySlug, brandSlug: searchParams.brand, search: searchParams.q }),
    getCategories(),
    getBrands(),
  ]);

  const name = localized(category, "name", locale);
  const description = localized(category, "description", locale);

  return (
    <section className="section-y !pt-10 sm:!pt-14">
      <Container>
        <SectionHeading eyebrow={dict.nav.products} heading={name} subtext={description} />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <ProductFilters
                locale={locale}
                dict={dict}
                categories={categories}
                brands={brands.filter((b) => b.categories.some((c) => c.slug === categorySlug))}
                activeCategory={categorySlug}
                activeBrand={searchParams.brand}
                activeSearch={searchParams.q}
              />
            </div>
          </aside>

          <div className="lg:col-span-9">
            <p className="mb-6 text-sm text-charcoal/50">
              {dict.products.showing} {products.length} {dict.products.resultsFor}
            </p>
            {products.length === 0 ? (
              <EmptyState heading={dict.common.noResults} text={dict.common.noResultsHint} />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} locale={locale} dict={dict} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
