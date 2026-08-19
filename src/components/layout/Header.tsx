"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ChevronRight, ChevronLeft } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

interface HeaderProps {
  locale: Locale;
  dict: Messages;
  logoUrl: string;
}

export function Header({ locale, dict, logoUrl }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isRtl = locale === "ar";
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navItems = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/products`, label: dict.nav.products },
    { href: `/${locale}/brands`, label: dict.nav.brands },
    { href: `/${locale}/partnership`, label: dict.nav.partnership },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  // Swap the current path's locale segment for the other language,
  // preserving the rest of the route so switching stays in-context.
  const otherLocale = locale === "en" ? "ar" : "en";
  const switchedPath = pathname.replace(/^\/(en|ar)/, `/${otherLocale}`);

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 ease-premium",
          scrolled
            ? "bg-warmwhite/90 backdrop-blur-md shadow-card"
            : "bg-warmwhite/60 backdrop-blur-sm"
        )}
      >
        <div className="mx-auto flex max-w-8xl items-center justify-between container-px py-3 lg:py-4">
          <Link href={`/${locale}`} className="flex items-center gap-2.5 shrink-0">
            <span className="relative block h-11 w-11 sm:h-12 sm:w-12 overflow-hidden rounded-full ring-1 ring-champagne/30">
              <Image
                src={logoUrl}
                alt="Gold Gravity Trading LLC"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </span>
            <span className="hidden sm:flex flex-col leading-tight">
              <span className="font-serif text-lg font-semibold tracking-tight text-charcoal">
                Gold Gravity
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-champagne-dark">
                Trading LLC
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200",
                  isActive(item.href)
                    ? "text-charcoal"
                    : "text-charcoal/60 hover:text-charcoal"
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute inset-x-4 -bottom-0.5 h-[2px] bg-champagne rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={switchedPath}
              className="hidden sm:inline-flex items-center rounded-full border border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal hover:border-champagne hover:bg-champagne/10 transition-colors"
              hrefLang={otherLocale}
            >
              {otherLocale.toUpperCase()}
            </Link>
            <Link
              href={`/${locale}/request-a-quote`}
              className="hidden sm:inline-flex items-center gap-1 rounded-full bg-charcoal text-warmwhite px-5 py-2.5 text-sm font-medium hover:bg-charcoal/90 transition-all duration-300 shadow-card hover:shadow-premium hover:-translate-y-0.5"
            >
              {dict.nav.quote}
              <ChevronIcon className="h-4 w-4" />
            </Link>
            <button
              type="button"
              aria-label={mobileOpen ? dict.nav.close : dict.nav.menu}
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 text-charcoal"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-premium",
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <div
          className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute top-0 h-full w-[85%] max-w-sm bg-warmwhite shadow-premium transition-transform duration-300 ease-premium flex flex-col pt-24 pb-8 px-6",
            isRtl ? "right-0" : "left-0",
            mobileOpen
              ? "translate-x-0"
              : isRtl
                ? "translate-x-full"
                : "-translate-x-full"
          )}
        >
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-champagne/15 text-charcoal"
                    : "text-charcoal/70 hover:bg-charcoal/5"
                )}
              >
                {item.label}
                <ChevronIcon className="h-4 w-4 opacity-40" />
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <Link
              href={`/${locale}/request-a-quote`}
              className="w-full text-center rounded-full bg-charcoal text-warmwhite px-5 py-3 text-sm font-medium"
            >
              {dict.nav.quote}
            </Link>
            <Link
              href={switchedPath}
              className="w-full text-center rounded-full border border-charcoal/15 px-5 py-3 text-sm font-medium text-charcoal"
              hrefLang={otherLocale}
            >
              {otherLocale === "ar" ? "العربية" : "English"}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
