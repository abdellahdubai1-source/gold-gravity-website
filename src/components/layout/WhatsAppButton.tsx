"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, generalWhatsAppMessage } from "@/lib/utils";
import type { Locale } from "@/i18n/config";

export function WhatsAppButton({
  locale,
  whatsappNumber,
  label,
}: {
  locale: Locale;
  whatsappNumber: string;
  label: string;
}) {
  const href = buildWhatsAppLink(whatsappNumber, generalWhatsAppMessage(locale));

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label={label}
      className="group fixed bottom-5 sm:bottom-7 z-50 ltr:right-5 ltr:sm:right-7 rtl:left-5 rtl:sm:left-7 flex items-center gap-2 rounded-full bg-[#25D366] text-white shadow-premium hover:shadow-[0_20px_50px_-10px_rgba(37,211,102,0.5)] transition-all duration-300 ease-premium hover:-translate-y-0.5 px-4 py-3.5 sm:px-5 sm:py-4"
    >
      <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" fill="white" strokeWidth={0} />
      <span className="hidden sm:inline text-sm font-semibold max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ms-0.5 transition-all duration-300 ease-premium">
        {label}
      </span>
    </a>
  );
}
