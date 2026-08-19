import type { Metadata } from "next";
import { Inter, Playfair_Display, Tajawal } from "next/font/google";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import "../globals.css";
import { locales, dir, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSiteSettings, FALLBACK_SETTINGS } from "@/lib/data/queries";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const settings = (await getSiteSettings()) ?? FALLBACK_SETTINGS;
  const title =
    params.locale === "ar" ? settings.default_seo_title_ar : settings.default_seo_title_en;
  const description =
    params.locale === "ar"
      ? settings.default_seo_description_ar
      : settings.default_seo_description_en;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://goldgravityuae.com";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title ?? "Gold Gravity Trading LLC",
      template: "%s | Gold Gravity Trading LLC",
    },
    description: description ?? undefined,
    alternates: {
      canonical: `${siteUrl}/${params.locale}`,
      languages: {
        en: `${siteUrl}/en`,
        ar: `${siteUrl}/ar`,
      },
    },
    openGraph: {
      type: "website",
      locale: params.locale === "ar" ? "ar_AE" : "en_AE",
      url: `${siteUrl}/${params.locale}`,
      siteName: "Gold Gravity Trading LLC",
      title: title ?? undefined,
      description: description ?? undefined,
      images: [{ url: "/images/logos/gold-gravity-logo.jpeg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? undefined,
      description: description ?? undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  if (!locales.includes(params.locale)) notFound();

  const { locale } = params;
  const settings = (await getSiteSettings()) ?? FALLBACK_SETTINGS;
  const logoUrl = settings.logo_url ?? "/images/logos/gold-gravity-logo.jpeg";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://goldgravityuae.com";

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Gold Gravity Trading LLC",
    url: siteUrl,
    logo: `${siteUrl}${logoUrl}`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: settings.call_number,
        contactType: "sales",
        areaServed: "AE",
        availableLanguage: ["English", "Arabic"],
      },
    ],
    sameAs: [settings.social_instagram, settings.social_facebook, settings.social_linkedin].filter(
      Boolean
    ),
  };

  return (
    <html lang={locale} dir={dir(locale)} className={`${inter.variable} ${playfair.variable} ${tajawal.variable}`}>
      <body className={locale === "ar" ? "font-arabic" : "font-sans"}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {settings.ga_measurement_id && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.ga_measurement_id}`}
            />
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${settings.ga_measurement_id}');`,
              }}
            />
          </>
        )}
        {children}
        <Toaster position={locale === "ar" ? "top-left" : "top-right"} richColors dir={dir(locale)} />
      </body>
    </html>
  );
}
