import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPage } from "@/lib/data/queries";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PartnershipForm } from "@/components/forms/PartnershipForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const page = await getPage("partnership");
  return {
    title: (params.locale === "ar" ? page?.seo_title_ar : page?.seo_title_en) ?? "Distribution Partner in UAE | Gold Gravity Trading",
    description:
      (params.locale === "ar" ? page?.seo_description_ar : page?.seo_description_en) ?? undefined,
  };
}

export default async function PartnershipPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const isAr = locale === "ar";
  const page = await getPage("partnership");
  const c: any = page?.content ?? {};

  return (
    <>
      <section className="section-y !pt-12 sm:!pt-16">
        <Container>
          <SectionHeading
            eyebrow={dict.partnership.title}
            heading={isAr ? c.heading_ar ?? dict.partnership.title : c.heading_en ?? dict.partnership.title}
            subtext={isAr ? c.intro_ar : c.intro_en}
          />

          <Reveal delay={150} className="mt-14">
            <h2 className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-champagne-dark">
              {dict.partnership.processHeading}
            </h2>
            <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(c.process ?? []).map((step: any, i: number) => (
                <li key={i} className="relative rounded-2xl border border-charcoal/10 bg-white p-6 shadow-card">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal font-serif text-sm font-semibold text-warmwhite">
                    {i + 1}
                  </span>
                  <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
                    {isAr ? step.ar : step.en}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </section>

      <section className="section-y bg-beige/50">
        <Container className="max-w-4xl">
          <Reveal>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal gold-underline pb-4 mb-10 inline-block">
              {dict.partnership.formHeading}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-2xl bg-white p-6 sm:p-10 shadow-card">
              <PartnershipForm locale={locale} dict={dict} />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
