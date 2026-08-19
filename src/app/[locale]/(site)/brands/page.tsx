import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getBrands } from "@/lib/data/queries";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BrandCard } from "@/components/product/BrandCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const isAr = params.locale === "ar";
  return {
    title: isAr ? "علاماتنا التجارية | جولد جرافيتي" : "Our Brands | Gold Gravity Trading",
    description: isAr
      ? "استكشف محفظة جولد جرافيتي المتنامية من العلامات التجارية: ويفز، برايم، ليمورا، والتوفير."
      : "Explore Gold Gravity's growing portfolio of brands: WAVES, PRIME, LIMORA and AL TAWFEER.",
  };
}

export default async function BrandsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const brands = await getBrands();

  return (
    <section className="section-y !pt-10 sm:!pt-14">
      <Container>
        <SectionHeading eyebrow={dict.nav.brands} heading={dict.brands.title} subtext={dict.brands.subtitle} align="center" className="mx-auto text-center" />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {brands.map((brand, i) => (
            <BrandCard key={brand.id} brand={brand} locale={locale} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
