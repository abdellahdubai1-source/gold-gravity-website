import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ChevronLeft, MessageCircle } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  getProductBySlug,
  getRelatedProducts,
  getSiteSettings,
  FALLBACK_SETTINGS,
} from "@/lib/data/queries";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductCard } from "@/components/product/ProductCard";
import { localized, buildWhatsAppLink, productWhatsAppMessage, cn } from "@/lib/utils";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };
  const title =
    (params.locale === "ar" ? product.seo_title_ar : product.seo_title_en) ??
    `${localized(product, "name", params.locale)} | ${product.brand.name} | Gold Gravity`;
  const description =
    (params.locale === "ar" ? product.seo_description_ar : product.seo_description_en) ??
    localized(product, "short_description", params.locale) ??
    undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.locale}/products/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      images: product.main_image_url ? [{ url: product.main_image_url }] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { locale, slug } = params;
  const dict = getDictionary(locale);
  const isAr = locale === "ar";
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, settings] = await Promise.all([
    getRelatedProducts(product),
    getSiteSettings(),
  ]);
  const s = settings ?? FALLBACK_SETTINGS;

  const name = localized(product, "name", locale);
  const description = localized(product, "short_description", locale);
  const categoryName = product.categories[0] ? localized(product.categories[0], "name", locale) : null;

  const images = [
    product.main_image_url
      ? { url: product.main_image_url, alt: name }
      : null,
    ...product.images.map((img) => ({
      url: img.image_url,
      alt: localized(img, "alt_text", locale) || name,
    })),
  ].filter(Boolean) as { url: string; alt: string }[];

  const whatsappHref = buildWhatsAppLink(
    s.whatsapp_number,
    productWhatsAppMessage(name, product.brand.name, locale)
  );

  const quoteParams = new URLSearchParams({
    product: product.slug,
    brand: product.brand.slug,
    ...(product.categories[0] ? { category: product.categories[0].slug } : {}),
  });

  const specs = [
    { label: dict.common.brand, value: product.brand.name },
    { label: dict.common.origin, value: product.country_of_origin },
    { label: dict.common.size, value: product.size_label },
    { label: dict.common.carton, value: product.carton_qty },
    { label: dict.common.barcode, value: product.barcode },
  ].filter((s) => s.value);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: images.map((i) => i.url),
    brand: { "@type": "Brand", name: product.brand.name },
    gtin: product.barcode || undefined,
    countryOfOrigin: product.country_of_origin || undefined,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceSpecification: undefined,
      url: `${getSiteUrl()}/${locale}/products/${product.slug}`,
    },
  };

  return (
    <section className="section-y !pt-8 sm:!pt-10">
      <Container>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-charcoal/50">
          <Link href={`/${locale}`} className="hover:text-champagne-dark transition-colors">
            {dict.common.home}
          </Link>
          <ChevronIcon className="h-3.5 w-3.5" />
          <Link href={`/${locale}/products`} className="hover:text-champagne-dark transition-colors">
            {dict.nav.products}
          </Link>
          <ChevronIcon className="h-3.5 w-3.5" />
          <Link href={`/${locale}/brands/${product.brand.slug}`} className="hover:text-champagne-dark transition-colors">
            {product.brand.name}
          </Link>
          <ChevronIcon className="h-3.5 w-3.5" />
          <span className="text-charcoal/70 line-clamp-1">{name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={images} productName={name} />

          <div>
            <div className="flex items-center gap-3">
              <Link
                href={`/${locale}/brands/${product.brand.slug}`}
                className="text-sm font-semibold uppercase tracking-wide text-champagne-dark hover:text-champagne transition-colors"
              >
                {product.brand.name}
              </Link>
              {categoryName && (
                <>
                  <span className="text-charcoal/20">/</span>
                  <span className="text-sm text-charcoal/50">{categoryName}</span>
                </>
              )}
            </div>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-semibold leading-tight text-charcoal text-balance">
              {name}
            </h1>
            {description && (
              <p className="mt-5 text-base leading-relaxed text-charcoal/65">{description}</p>
            )}

            {specs.length > 0 && (
              <dl className="mt-8 divide-y divide-charcoal/10 rounded-2xl border border-charcoal/10 bg-white overflow-hidden">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                    <dt className="text-charcoal/50">{spec.label}</dt>
                    <dd className="font-medium text-charcoal text-end">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <p className="mt-5 text-xs text-charcoal/40 italic">{dict.productDetail.priceNote}</p>

            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <Button href={`/${locale}/request-a-quote?${quoteParams.toString()}`} size="lg" className="flex-1">
                {dict.common.requestQuote}
              </Button>
              <Button
                href={whatsappHref}
                variant="secondary"
                size="lg"
                className="flex-1 bg-[#25D366] text-white hover:bg-[#1fb857]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                {dict.common.whatsappInquiry}
              </Button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-serif text-2xl font-semibold text-charcoal gold-underline pb-4 mb-10 inline-block">
              {dict.productDetail.otherProducts} {product.brand.name}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              {related.slice(0, 4).map((rp, i) => (
                <ProductCard
                  key={rp.id}
                  product={{ ...rp, brand: product.brand, categories: product.categories, images: [] }}
                  locale={locale}
                  dict={dict}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
