import type { Locale } from "./config";
import en, { type Messages } from "./messages/en";
import ar from "./messages/ar";

const dictionaries: Record<Locale, Messages> = { en, ar };

export function getDictionary(locale: Locale): Messages {
  return dictionaries[locale] ?? dictionaries.en;
}

export type { Messages };
