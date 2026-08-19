import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPage, getCategories, getBrands, getProducts } from "@/lib/data/queries";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { QuoteForm } from "@/components/forms/QuoteForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const page = await getPage("request-a-quote");
  return {
    title: (params.locale === "ar" ? page?.seo_title_ar : page?.seo_title_en) ?? "Request a Wholesale Quote | Gold Gravity UAE",
    description:
      (params.locale === "ar" ? page?.seo_description_ar : page?.seo_description_en) ?? undefined,
  };
}

export default async function QuotePage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { product?: string; brand?: string; category?: string };
}) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const isAr = locale === "ar";

  const [page, categories, brands, products] = await Promise.all([
    getPage("request-a-quote"),
    getCategories(),
    getBrands(),
    getProducts({}),
  ]);
  const c: any = page?.content ?? {};

  const initial = {
    categoryId: categories.find((cat) => cat.slug === searchParams.category)?.id,
    brandId: brands.find((b) => b.slug === searchParams.brand)?.id,
    productId: products.find((p) => p.slug === searchParams.product)?.id,
  };

  return (
    <section className="section-y !pt-12 sm:!pt-16">
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow={dict.nav.quote}
          heading={isAr ? c.heading_ar ?? dict.quote.title : c.heading_en ?? dict.quote.title}
          subtext={isAr ? c.intro_ar : c.intro_en}
        />
        <Reveal delay={100} className="mt-12 rounded-2xl bg-white p-6 sm:p-10 shadow-card">
          <QuoteForm
            locale={locale}
            dict={dict}
            categories={categories}
            brands={brands}
            products={products}
            initial={initial}
          />
        </Reveal>
      </Container>
    </section>
  );
}
