import { getDictionary } from "@/i18n/dictionaries";
import { getSiteSettings, FALLBACK_SETTINGS } from "@/lib/data/queries";
import type { Locale } from "@/i18n/config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

// Wraps every public-facing page (home, about, products, brands,
// partnership, quote, contact, legal pages) with the shared header,
// footer and floating WhatsApp button. Deliberately NOT applied to
// /admin, which has its own minimal dashboard chrome.
export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const settings = (await getSiteSettings()) ?? FALLBACK_SETTINGS;
  const logoUrl = settings.logo_url ?? "/images/logos/gold-gravity-logo.jpeg";

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:rounded-full focus:bg-charcoal focus:px-5 focus:py-3 focus:text-warmwhite"
      >
        Skip to content
      </a>
      <Header locale={locale} dict={dict} logoUrl={logoUrl} />
      <main id="main-content">{children}</main>
      <Footer locale={locale} dict={dict} settings={settings} logoUrl={logoUrl} />
      <WhatsAppButton locale={locale} whatsappNumber={settings.whatsapp_number} label={dict.common.whatsappUs} />
    </>
  );
}
