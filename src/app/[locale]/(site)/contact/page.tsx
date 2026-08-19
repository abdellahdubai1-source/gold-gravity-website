import type { Metadata } from "next";
import { Phone, MessageCircle, Mail, Clock, MapPin } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPage, getSiteSettings, FALLBACK_SETTINGS } from "@/lib/data/queries";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { buildWhatsAppLink, generalWhatsAppMessage, formatPhoneForTel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const page = await getPage("contact");
  return {
    title: (params.locale === "ar" ? page?.seo_title_ar : page?.seo_title_en) ?? "Contact Gold Gravity Trading LLC | UAE",
    description:
      (params.locale === "ar" ? page?.seo_description_ar : page?.seo_description_en) ?? undefined,
  };
}

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const isAr = locale === "ar";

  const [page, settings] = await Promise.all([getPage("contact"), getSiteSettings()]);
  const s = settings ?? FALLBACK_SETTINGS;
  const c: any = page?.content ?? {};
  const whatsappHref = buildWhatsAppLink(s.whatsapp_number, generalWhatsAppMessage(locale));
  const workingHours = isAr ? s.working_hours_ar : s.working_hours_en;
  const address = isAr ? s.address_ar : s.address_en;

  const infoItems = [
    { Icon: Phone, label: dict.contact.mainCall, value: s.call_number, href: `tel:${formatPhoneForTel(s.call_number)}` },
    { Icon: MessageCircle, label: dict.contact.whatsapp, value: `+${s.whatsapp_number}`, href: whatsappHref, external: true },
    { Icon: Mail, label: dict.contact.email, value: s.email, href: `mailto:${s.email}` },
    { Icon: Clock, label: dict.contact.workingHours, value: workingHours },
    { Icon: MapPin, label: dict.contact.address, value: address ?? dict.common.pending },
  ];

  return (
    <section className="section-y !pt-12 sm:!pt-16">
      <Container>
        <SectionHeading
          eyebrow={dict.nav.contact}
          heading={isAr ? c.heading_ar ?? dict.contact.title : c.heading_en ?? dict.contact.title}
          subtext={isAr ? c.intro_ar : c.intro_en}
        />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal delay={100} className="lg:col-span-5">
            <div className="rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-8 shadow-card">
              <h2 className="font-serif text-xl font-semibold text-charcoal">{dict.contact.company}</h2>
              <p className="mt-1 text-sm text-charcoal/50">Gold Gravity Trading LLC</p>
              <ul className="mt-7 space-y-6">
                {infoItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-champagne/15 text-champagne-dark">
                      <item.Icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/45">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="mt-0.5 block text-sm font-medium text-charcoal hover:text-champagne-dark transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-0.5 text-sm font-medium text-charcoal">{item.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {!s.google_maps_embed && (
                <div className="mt-7 flex items-center gap-3 rounded-xl bg-beige/60 px-4 py-3.5 text-xs text-charcoal/55">
                  <MapPin className="h-4 w-4 shrink-0 text-champagne-dark" />
                  {isAr
                    ? "العنوان وموقع خرائط جوجل قيد التأكيد من العميل."
                    : "Address and Google Maps location are pending client confirmation."}
                </div>
              )}
              {s.google_maps_embed && (
                <div className="mt-7 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line react/no-danger */}
                  <div dangerouslySetInnerHTML={{ __html: s.google_maps_embed }} />
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-7">
            <div className="rounded-2xl bg-white p-6 sm:p-10 shadow-card">
              <h2 className="font-serif text-xl font-semibold text-charcoal mb-7">{dict.contact.formHeading}</h2>
              <ContactForm locale={locale} dict={dict} />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
