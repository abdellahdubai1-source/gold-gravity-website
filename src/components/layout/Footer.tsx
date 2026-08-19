import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MessageCircle, Clock, Instagram, Facebook, Linkedin } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionaries";
import type { SiteSettings } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { buildWhatsAppLink, generalWhatsAppMessage, formatPhoneForTel } from "@/lib/utils";

export function Footer({
  locale,
  dict,
  settings,
  logoUrl,
}: {
  locale: Locale;
  dict: Messages;
  settings: SiteSettings;
  logoUrl: string;
}) {
  const year = new Date().getFullYear();
  const workingHours = locale === "ar" ? settings.working_hours_ar : settings.working_hours_en;
  const whatsappHref = buildWhatsAppLink(settings.whatsapp_number, generalWhatsAppMessage(locale));

  const navItems = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/products`, label: dict.nav.products },
    { href: `/${locale}/brands`, label: dict.nav.brands },
    { href: `/${locale}/partnership`, label: dict.nav.partnership },
    { href: `/${locale}/request-a-quote`, label: dict.nav.quote },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const socials = [
    { href: settings.social_instagram, Icon: Instagram, label: "Instagram" },
    { href: settings.social_facebook, Icon: Facebook, label: "Facebook" },
    { href: settings.social_linkedin, Icon: Linkedin, label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-20 border-t border-charcoal/10 bg-beige/60">
      <Container className="section-y !py-14 lg:!py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href={`/${locale}`} className="flex items-center gap-2.5">
              <span className="relative block h-11 w-11 overflow-hidden rounded-full ring-1 ring-champagne/30">
                <Image src={logoUrl} alt="Gold Gravity Trading LLC" fill sizes="44px" className="object-cover" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-serif text-lg font-semibold text-charcoal">Gold Gravity</span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-champagne-dark">Trading LLC</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-charcoal/60">
              {dict.footer.tagline}
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {socials.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/70 hover:border-champagne hover:text-champagne-dark transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-charcoal gold-underline pb-3 mb-5 inline-block">
              {dict.footer.quickLinks}
            </h3>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-charcoal/65 hover:text-champagne-dark transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-charcoal gold-underline pb-3 mb-5 inline-block">
              {dict.footer.getInTouch}
            </h3>
            <ul className="space-y-3.5 text-sm text-charcoal/70">
              <li>
                <a href={`tel:${formatPhoneForTel(settings.call_number)}`} className="flex items-center gap-3 hover:text-champagne-dark transition-colors">
                  <Phone className="h-4 w-4 shrink-0 text-champagne-dark" />
                  {settings.call_number}
                </a>
              </li>
              <li>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-champagne-dark transition-colors">
                  <MessageCircle className="h-4 w-4 shrink-0 text-champagne-dark" />
                  +{settings.whatsapp_number.replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4")}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 hover:text-champagne-dark transition-colors">
                  <Mail className="h-4 w-4 shrink-0 text-champagne-dark" />
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 shrink-0 text-champagne-dark mt-0.5" />
                <span>
                  {workingHours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-charcoal/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-charcoal/50">
            © {year} Gold Gravity Trading LLC. {dict.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/privacy-policy`} className="text-xs text-charcoal/50 hover:text-champagne-dark transition-colors">
              {dict.footer.privacy}
            </Link>
            <Link href={`/${locale}/terms-and-conditions`} className="text-xs text-charcoal/50 hover:text-champagne-dark transition-colors">
              {dict.footer.terms}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
