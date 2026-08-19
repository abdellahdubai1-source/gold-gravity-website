import { z } from "zod";

const phoneRegex = /^[+\d][\d\s-]{6,20}$/;

export const quoteFormSchema = z.object({
  company_name: z.string().min(2),
  contact_person: z.string().min(2),
  phone: z.string().regex(phoneRegex),
  email: z.string().email().optional().or(z.literal("")),
  emirate: z.string().min(2),
  business_type: z.string().optional(),
  category_id: z.string().optional(),
  brand_id: z.string().optional(),
  product_id: z.string().optional(),
  quantity: z.string().optional(),
  notes: z.string().optional(),
  locale: z.string().optional(),
  // honeypot — must stay empty
  website: z.string().max(0).optional(),
});
export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export const partnershipFormSchema = z.object({
  company_name: z.string().min(2),
  contact_person: z.string().min(2),
  country: z.string().min(2),
  phone: z.string().regex(phoneRegex),
  email: z.string().email().optional().or(z.literal("")),
  brand_name: z.string().optional(),
  product_category: z.string().optional(),
  country_of_origin: z.string().optional(),
  company_website: z.string().optional(),
  message: z.string().optional(),
  locale: z.string().optional(),
  website: z.string().max(0).optional(),
});
export type PartnershipFormValues = z.infer<typeof partnershipFormSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5),
  locale: z.string().optional(),
  website: z.string().max(0).optional(),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;
