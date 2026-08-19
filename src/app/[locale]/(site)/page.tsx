import type { Metadata } from "next";
import Image from "next/image";
import NextLink from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  getPage,
  getCategories,
  getBrands,
  getSiteSettings,
  FALLBACK_SETTINGS,
} from "@/lib/data/queries";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CategoryCard } from "@/components/product/CategoryCard";
import { BrandCard } from "@/components/product/BrandCard";
import { buildWhatsAppLink, generalWhatsAppMessage } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const page = await getPage("home");
  const title = params.locale === "ar" ? page?.seo_title_ar : page?.seo_title_en;
  const description = params.locale === "ar" ? page?.seo_description_ar : page?.seo_description_en;
  return {
    title: title ?? "Gold Gravity Trading LLC",
    description: description ?? undefined,
  };
}

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [page, categories, brands, settings] = await Promise.all([
    getPage("home"),
    getCategories(),
    getBrands(),
    getSiteSettings(),
  ]);

  const s = (settings ?? FALLBACK_SETTINGS);
  const c: any = page?.content ?? {};
  const hero = c.hero ?? {};

  const whatsappHref = buildWhatsAppLink(s.whatsapp_number, generalWhatsAppMessage(locale));

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-beige/70 via-warmwhite to-warmwhite">
        <div className="pointer-events-none absolute -top-40 rtl:-left-40 ltr:-right-40 h-[36rem] w-[36rem] rounded-full bg-champagne/15 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 rtl:-right-32 ltr:-left-32 h-96 w-96 rounded-full bg-champagne/10 blur-3xl" />

        <Container className="relative grid grid-cols-1 items-center gap-14 pt-16 sm:pt-20 lg:grid-cols-12 lg:pt-24 pb-16 sm:pb-20">
          <div className="lg:col-span-7 xl:col-span-6">
            <Reveal>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-champagne/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-champagne-dark">
                Gold Gravity Trading LLC
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold leading-[1.1] text-charcoal text-balance">
                {hero.heading_en && isAr ? hero.heading_ar : hero.heading_en ?? dict.home.categoriesHeading}
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-charcoal/65">
                {isAr ? hero.subtext_ar : hero.subtext_en}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
                <Button href={`/${locale}/products`} size="lg">
                  {isAr ? hero.cta_primary_ar : hero.cta_primary_en}
                  <ArrowIcon className="h-4 w-4" />
                </Button>
                <Button href={`/${locale}/partnership`} variant="outline" size="lg">
                  {isAr ? hero.cta_secondary_ar : hero.cta_secondary_en}
                </Button>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
                {(hero.highlights ?? []).map((h: any, i: number) => (
                  <div key={i}>
                    <dt className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
                      {(isAr ? h.ar : h.en).match(/[\d+]+/)?.[0] ?? ""}
                    </dt>
                    <dd className="mt-1 text-xs sm:text-sm text-charcoal/55 leading-snug">
                      {(isAr ? h.ar : h.en).replace(/^[\d+]+\s*/, "")}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-5 xl:col-span-6">
            <Reveal delay={200} className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-premium">
                <Image
                  src="/images/key-visuals/warehouse.png"
                  alt="Gold Gravity warehouse — organized distribution across the UAE"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 rtl:-right-4 ltr:-left-4 sm:rtl:-right-8 sm:ltr:-left-8 w-[75%] rounded-2xl bg-white p-5 shadow-premium">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-champagne/15 text-champagne-dark">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-serif text-lg font-semibold text-charcoal leading-none">400+</p>
                    <p className="mt-1 text-xs text-charcoal/55">
                      {isAr ? "عميل في الإمارات" : "UAE Clients Served"}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="section-y">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow={isAr ? "الفئات" : "Categories"}
              heading={isAr ? c.categories_heading_ar ?? dict.home.categoriesHeading : c.categories_heading_en ?? dict.home.categoriesHeading}
            />
            <Reveal>
              <NextLink
                href={`/${locale}/products`}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-champagne-dark hover:text-champagne transition-colors"
              >
                {dict.common.viewAllProducts}
                <ArrowIcon className="h-4 w-4" />
              </NextLink>
            </Reveal>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
            {categories.map((category, i) => (
              <CategoryCard key={category.id} category={category} locale={locale} index={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* ================= BRANDS ================= */}
      <section className="section-y bg-beige/50">
        <Container>
          <SectionHeading
            eyebrow={isAr ? "علاماتنا" : "Our Brands"}
            heading={isAr ? c.brands_heading_ar ?? dict.home.brandsHeading : c.brands_heading_en ?? dict.home.brandsHeading}
            subtext={isAr ? c.brands_subtext_ar : c.brands_subtext_en}
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand, i) => (
              <BrandCard key={brand.id} brand={brand} locale={locale} index={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="section-y">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-premium">
              <Image
                src="/images/key-visuals/warehouse.png"
                alt="Gold Gravity distribution warehouse"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow={isAr ? "من نحن" : "About Us"}
              heading={isAr ? c.about_heading_ar ?? dict.about.title : c.about_heading_en ?? dict.about.title}
            />
            <Reveal delay={100}>
              <p className="mt-6 text-base leading-relaxed text-charcoal/65">
                {isAr ? c.about_text_ar : c.about_text_en}
              </p>
              <Button href={`/${locale}/about`} variant="outline" className="mt-8">
                {dict.common.learnMore}
                <ArrowIcon className="h-4 w-4" />
              </Button>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ================= MANUFACTURING ================= */}
      <section className="section-y bg-charcoal text-warmwhite">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-champagne-light">
                {isAr ? "التصنيع" : "Manufacturing"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold leading-tight text-warmwhite text-balance">
                {isAr ? c.manufacturing_heading_ar ?? dict.manufacturing.heading : c.manufacturing_heading_en ?? dict.manufacturing.heading}
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-6 text-base leading-relaxed text-warmwhite/70">
                {isAr ? c.manufacturing_text_ar : c.manufacturing_text_en}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {(c.manufacturing_keywords ?? []).map((k: any, i: number) => (
                  <span
                    key={i}
                    className="rounded-full border border-champagne/30 bg-champagne/10 px-4 py-1.5 text-sm font-medium text-champagne-light"
                  >
                    {isAr ? k.ar : k.en}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={150} className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-premium">
              <Image
                src="/images/key-visuals/factory.png"
                alt="Gold Gravity manufacturing experience — plastic products facility"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ================= DISTRIBUTION ================= */}
      <section className="section-y">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-premium">
              <Image
                src="/images/key-visuals/warehouse.png"
                alt="From warehouse to market — Gold Gravity distribution network"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow={isAr ? "التوزيع" : "Distribution"}
              heading={isAr ? c.distribution_heading_ar ?? dict.distribution.heading : c.distribution_heading_en ?? dict.distribution.heading}
            />
            <Reveal delay={100}>
              <p className="mt-6 text-base leading-relaxed text-charcoal/65">
                {isAr ? c.distribution_text_ar : c.distribution_text_en}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ================= WHY GOLD GRAVITY ================= */}
      <section className="section-y bg-beige/50">
        <Container>
          <SectionHeading
            eyebrow={isAr ? "لماذا نحن" : "Why Us"}
            heading={isAr ? c.why_heading_ar ?? dict.home.whyHeading : c.why_heading_en ?? dict.home.whyHeading}
            align="center"
            className="mx-auto text-center"
          />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {(c.why_pillars ?? []).map((pillar: any, i: number) => (
              <Reveal key={i} delay={i * 90}>
                <div className="h-full rounded-2xl border border-charcoal/10 bg-white p-7 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-premium hover:border-champagne/40">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-champagne/15 font-serif text-lg font-semibold text-champagne-dark">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-semibold text-charcoal leading-snug">
                    {isAr ? pillar.title_ar : pillar.title_en}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-charcoal/60">
                    {isAr ? pillar.text_ar : pillar.text_en}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="section-y">
        <Container>
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-charcoal via-charcoal to-[#3a3630] px-6 py-16 text-center sm:px-16 sm:py-20">
            <div className="pointer-events-none absolute -top-20 rtl:right-1/4 ltr:left-1/4 h-72 w-72 rounded-full bg-champagne/20 blur-3xl" />
            <h2 className="relative font-serif text-3xl sm:text-4xl font-semibold text-warmwhite text-balance">
              {isAr ? c.final_cta_heading_ar : c.final_cta_heading_en}
            </h2>
            <p className="relative mx-auto mt-5 max-w-2xl text-base leading-relaxed text-warmwhite/70">
              {isAr ? c.final_cta_text_ar : c.final_cta_text_en}
            </p>
            <div className="relative mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Button href={`/${locale}/request-a-quote`} variant="secondary" size="lg">
                {dict.home.ctaPrimary}
              </Button>
              <Button href={whatsappHref} variant="outline" size="lg" className="border-warmwhite/25 text-warmwhite hover:bg-warmwhite/10 hover:border-warmwhite/40" target="_blank" rel="noopener noreferrer">
                {dict.home.ctaSecondary}
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
