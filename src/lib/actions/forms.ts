"use server";

import { createClient } from "@/lib/supabase/server";
import {
  quoteFormSchema,
  partnershipFormSchema,
  contactFormSchema,
  type QuoteFormValues,
  type PartnershipFormValues,
  type ContactFormValues,
} from "@/lib/validation";

type ActionResult = { success: true } | { success: false; error: string };

export async function submitQuoteRequest(values: QuoteFormValues): Promise<ActionResult> {
  const parsed = quoteFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Please check the highlighted fields and try again." };
  }
  if (parsed.data.website) {
    // Honeypot triggered — silently report success to the bot.
    return { success: true };
  }

  try {
    const supabase = createClient();
    const { website, ...row } = parsed.data;
    const { error } = await supabase.from("quote_requests").insert({
      ...row,
      email: row.email || null,
      // Empty-string selects (uncategorized fields left blank) must be
      // nulled out — the DB columns are nullable uuid/text, and "" is
      // not a valid uuid.
      category_id: row.category_id || null,
      brand_id: row.brand_id || null,
      product_id: row.product_id || null,
      business_type: row.business_type || null,
      quantity: row.quantity || null,
      notes: row.notes || null,
    });
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("[submitQuoteRequest]", err);
    return { success: false, error: "We couldn't submit your request. Please try again or contact us via WhatsApp." };
  }
}

export async function submitPartnershipRequest(
  values: PartnershipFormValues,
  files: { name: string; url: string }[]
): Promise<ActionResult> {
  const parsed = partnershipFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Please check the highlighted fields and try again." };
  }
  if (parsed.data.website) {
    return { success: true };
  }

  try {
    const supabase = createClient();
    const { website, ...row } = parsed.data;
    const { error } = await supabase.from("partnership_submissions").insert({
      ...row,
      email: row.email || null,
      catalogue_files: files,
    });
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("[submitPartnershipRequest]", err);
    return { success: false, error: "We couldn't submit your product. Please try again or email us directly." };
  }
}

export async function submitContactMessage(values: ContactFormValues): Promise<ActionResult> {
  const parsed = contactFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Please check the highlighted fields and try again." };
  }
  if (parsed.data.website) {
    return { success: true };
  }

  try {
    const supabase = createClient();
    const { website, ...row } = parsed.data;
    const { error } = await supabase.from("contact_submissions").insert(row);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("[submitContactMessage]", err);
    return { success: false, error: "We couldn't send your message. Please try again or email us directly." };
  }
}
