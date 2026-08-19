import type { Metadata } from "next";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPage } from "@/lib/data/queries";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const page = await getPage("about");
  return {
    title: (params.locale === "ar" ? page?.seo_title_ar : page?.seo_title_en) ?? "About Us | Gold Gravity Trading LLC",
    description:
      (params.locale === "ar" ? page?.seo_description_ar : page?.seo_description_en) ?? undefined,
  };
}

export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const isAr = locale === "ar";
  const page = await getPage("about");
  const c: any = page?.content ?? {};

  return (
    <>
      <section className="section-y !pt-12 sm:!pt-16">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow="Gold Gravity Trading LLC" heading={dict.about.title} />
            <Reveal delay={100}>
              <p className="mt-6 text-base leading-relaxed text-charcoal/65">
                {isAr ? c.intro_ar : c.intro_en}
              </p>
            </Reveal>
          </div>
          <Reveal delay={150} className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-premium">
              <Image
                src="/images/key-visuals/warehouse.png"
                alt="Gold Gravity Trading LLC warehouse operations"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="section-y bg-beige/50">
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Reveal className="rounded-2xl bg-white p-8 sm:p-10 shadow-card">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-dark">
                {dict.about.vision}
              </span>
              <p className="mt-4 font-serif text-xl sm:text-2xl leading-snug text-charcoal text-balance">
                {isAr ? c.vision_ar : c.vision_en}
              </p>
            </Reveal>
            <Reveal delay={100} className="rounded-2xl bg-white p-8 sm:p-10 shadow-card">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-dark">
                {dict.about.mission}
              </span>
              <p className="mt-4 font-serif text-xl sm:text-2xl leading-snug text-charcoal text-balance">
                {isAr ? c.mission_ar : c.mission_en}
              </p>
            </Reveal>
          </div>

          <Reveal delay={150} className="mt-14 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-dark">
              {dict.about.values}
            </span>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {(c.values ?? []).map((v: any, i: number) => (
                <span
                  key={i}
                  className="rounded-full border border-charcoal/10 bg-white px-6 py-2.5 text-sm font-medium text-charcoal shadow-card"
                >
                  {isAr ? v.ar : v.en}
                </span>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="section-y">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-premium">
              <Image
                src="/images/key-visuals/factory.png"
                alt="Gold Gravity manufacturing experience"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow={isAr ? "التصنيع" : "Manufacturing"} heading={dict.manufacturing.heading} />
            <Reveal delay={100}>
              <p className="mt-6 text-base leading-relaxed text-charcoal/65">
                Gold Gravity's experience extends to plastic products manufacturing in Kuwait,
                covering a wide range of plastic and packaging solutions for commercial and
                consumer applications.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
