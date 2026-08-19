import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Builds a WhatsApp deep link with a pre-filled, locale-aware message. */
export function buildWhatsAppLink(
  phoneDigitsOnly: string,
  message: string
): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneDigitsOnly}?text=${encoded}`;
}

export function productWhatsAppMessage(
  productName: string,
  brandName: string,
  locale: string
): string {
  if (locale === "ar") {
    return `مرحبًا Gold Gravity، أنا مهتم بمنتج ${productName} من ${brandName}. أرغب في مزيد من المعلومات / عرض سعر.`;
  }
  return `Hello Gold Gravity, I am interested in ${productName} by ${brandName}. I would like more information / a quotation.`;
}

export function generalWhatsAppMessage(locale: string): string {
  if (locale === "ar") {
    return "مرحبًا Gold Gravity، أرغب في معرفة المزيد عن منتجاتكم.";
  }
  return "Hello Gold Gravity, I would like to know more about your products.";
}

export function formatPhoneForTel(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

export function localized<T extends Record<string, any>>(
  obj: T,
  field: string,
  locale: string
): string {
  const key = `${field}_${locale}` as keyof T;
  return (obj[key] as unknown as string) ?? (obj[`${field}_en` as keyof T] as unknown as string) ?? "";
}
