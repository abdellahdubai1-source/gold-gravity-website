// =====================================================================
// Hand-written types mirroring supabase/schema.sql.
// If the schema changes, update this file to match.
// =====================================================================

export type ProductStatus = "published" | "draft";
export type LeadStatus = "new" | "contacted" | "closed";

export interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  image_url: string | null;
  display_order: number;
  seo_title_en: string | null;
  seo_title_ar: string | null;
  seo_description_en: string | null;
  seo_description_ar: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  brand_line_en: string | null;
  brand_line_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  country_of_origin: string | null;
  display_order: number;
  seo_title_en: string | null;
  seo_title_ar: string | null;
  seo_description_en: string | null;
  seo_description_ar: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  slug: string;
  brand_id: string;
  name_en: string;
  name_ar: string;
  short_description_en: string | null;
  short_description_ar: string | null;
  country_of_origin: string | null;
  size_label: string | null;
  carton_qty: string | null;
  barcode: string | null;
  main_image_url: string | null;
  status: ProductStatus;
  display_order: number;
  seo_title_en: string | null;
  seo_title_ar: string | null;
  seo_description_en: string | null;
  seo_description_ar: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text_en: string | null;
  alt_text_ar: string | null;
  sort_order: number;
  created_at: string;
}

export interface PageContent {
  id: string;
  slug: string;
  title_en: string | null;
  title_ar: string | null;
  content: Record<string, unknown>;
  seo_title_en: string | null;
  seo_title_ar: string | null;
  seo_description_en: string | null;
  seo_description_ar: string | null;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  whatsapp_number: string;
  call_number: string;
  email: string;
  working_hours_en: string;
  working_hours_ar: string;
  address_en: string | null;
  address_ar: string | null;
  google_maps_embed: string | null;
  social_instagram: string | null;
  social_facebook: string | null;
  social_linkedin: string | null;
  social_x: string | null;
  default_seo_title_en: string | null;
  default_seo_title_ar: string | null;
  default_seo_description_en: string | null;
  default_seo_description_ar: string | null;
  ga_measurement_id: string | null;
  logo_url: string | null;
  updated_at: string;
}

export interface QuoteRequest {
  id: string;
  created_at: string;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string | null;
  emirate: string;
  business_type: string | null;
  category_id: string | null;
  brand_id: string | null;
  product_id: string | null;
  quantity: string | null;
  notes: string | null;
  status: LeadStatus;
  locale: string | null;
}

export interface PartnershipSubmission {
  id: string;
  created_at: string;
  company_name: string;
  contact_person: string;
  country: string;
  phone: string;
  email: string | null;
  brand_name: string | null;
  product_category: string | null;
  country_of_origin: string | null;
  company_website: string | null;
  message: string | null;
  catalogue_files: { name: string; url: string }[];
  status: LeadStatus;
  locale: string | null;
}

export interface ContactSubmission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: LeadStatus;
  locale: string | null;
}

export interface ProductWithRelations extends Product {
  brand: Brand;
  categories: Category[];
  images: ProductImage[];
}

export interface BrandWithCategories extends Brand {
  categories: Category[];
}
