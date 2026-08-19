import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getBrandBySlug, getProducts, getSiteSettings, FALLBACK_SETTINGS } from "@/lib/data/queries";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/product/ProductCard";
import { localized, buildWhatsAppLink, generalWhatsAppMessage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const brand = await getBrandBySlug(params.slug);
  if (!brand) return { title: "Brand Not Found" };
  const title =
    (params.locale === "ar" ? brand.seo_title_ar : brand.seo_title_en) ?? `${brand.name} | Gold Gravity Trading`;
  const description =
    (params.locale === "ar" ? brand.seo_description_ar : brand.seo_description_en) ??
    localized(brand, "description", params.locale);
  return { title, description };
}

export default async function BrandDetailPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { locale, slug } = params;
  const dict = getDictionary(locale);

  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const [products, settings] = await Promise.all([
    getProducts({ brandSlug: slug }),
    getSiteSettings(),
  ]);
  const s = settings ?? FALLBACK_SETTINGS;

  const line = localized(brand, "brand_line", locale);
  const description = localized(brand, "description", locale);
  const whatsappHref = buildWhatsAppLink(s.whatsapp_number, generalWhatsAppMessage(locale));

  return (
    <>
      <section className="relative overflow-hidden bg-beige/50">
        <Container className="grid grid-cols-1 items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <div className="relative mb-6 flex h-16 w-fit items-center">
              {brand.logo_url ? (
                <Image src={brand.logo_url} alt={brand.name} width={200} height={64} className="max-h-16 w-auto object-contain" />
              ) : (
                <span className="font-serif text-4xl font-bold text-charcoal">{brand.name}</span>
              )}
            </div>
            {line && (
              <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.15em] text-champagne-dark">
                {line}
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal text-balance">
              {brand.name}
            </h1>
            {description && (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal/65">{description}</p>
            )}

            {brand.categories.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {brand.categories.map((c) => (
                  <span key={c.id} className="rounded-full border border-champagne/40 bg-champagne/10 px-4 py-1.5 text-xs font-medium text-champagne-dark">
                    {localized(c, "name", locale)}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
              <Button href={`/${locale}/request-a-quote?brand=${brand.slug}`} size="lg">
                {dict.common.requestQuote}
              </Button>
              <Button href={whatsappHref} variant="outline" size="lg" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                {dict.common.whatsappUs}
              </Button>
            </div>
          </Reveal>

          {brand.hero_image_url && (
            <Reveal delay={150} className="relative">
              <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-white shadow-premium">
                <Image
                  src={brand.hero_image_url}
                  alt={brand.name}
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-contain p-10"
                />
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      <section className="section-y">
        <Container>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal gold-underline pb-4 mb-10 inline-block">
            {brand.name} {dict.common.products}
          </h2>
          {products.length === 0 ? (
            <EmptyState heading={dict.common.noResults} text={dict.common.noResultsHint} />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} locale={locale} dict={dict} index={i} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
