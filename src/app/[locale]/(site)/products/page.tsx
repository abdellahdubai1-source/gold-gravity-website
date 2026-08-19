import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getProducts, getCategories, getBrands, getPage } from "@/lib/data/queries";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const page = await getPage("products");
  const title =
    (params.locale === "ar" ? page?.seo_title_ar : page?.seo_title_en) ??
    "Gold Gravity Products | Food, Snacks, Plastic & Household Products UAE";
  const description =
    (params.locale === "ar" ? page?.seo_description_ar : page?.seo_description_en) ??
    "Explore Gold Gravity's growing portfolio of food and consumer products for wholesale supply and distribution across the UAE.";
  return { title, description };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { category?: string; brand?: string; q?: string };
}) {
  const { locale } = params;
  const dict = getDictionary(locale);

  const [products, categories, brands] = await Promise.all([
    getProducts({
      categorySlug: searchParams.category,
      brandSlug: searchParams.brand,
      search: searchParams.q,
    }),
    getCategories(),
    getBrands(),
  ]);

  return (
    <section className="section-y !pt-10 sm:!pt-14">
      <Container>
        <SectionHeading eyebrow={dict.nav.products} heading={dict.products.title} subtext={dict.products.subtitle} />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <ProductFilters
                locale={locale}
                dict={dict}
                categories={categories}
                brands={brands}
                activeCategory={searchParams.category}
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
