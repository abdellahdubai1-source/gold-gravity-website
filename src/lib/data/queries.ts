import "server-only";
import { createPublicClient as createClient } from "@/lib/supabase/public";
import type {
  Brand,
  BrandWithCategories,
  Category,
  PageContent,
  Product,
  ProductWithRelations,
  SiteSettings,
} from "@/types/database";

/**
 * Every function here reads published/public content only, so it uses
 * the cookie-free public client — calling cookies()/headers() here
 * would force every route that renders this data (including the
 * homepage and /sitemap.xml) into dynamic-only rendering.
 *
 * Every function here also fails soft: if Supabase isn't configured yet
 * (e.g. during local scaffolding before `.env.local` is filled in) or
 * a request errors, we log and return an empty/null result instead of
 * throwing — so the site renders its empty states instead of a 500.
 */

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("[getCategories]", err);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  } catch (err) {
    console.error("[getCategoryBySlug]", err);
    return null;
  }
}

export async function getBrands(): Promise<BrandWithCategories[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("brands")
      .select("*, brand_categories(category:categories(*))")
      .eq("is_published", true)
      .order("display_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((b: any) => ({
      ...b,
      categories: (b.brand_categories ?? []).map((bc: any) => bc.category).filter(Boolean),
    }));
  } catch (err) {
    console.error("[getBrands]", err);
    return [];
  }
}

export async function getBrandBySlug(slug: string): Promise<BrandWithCategories | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("brands")
      .select("*, brand_categories(category:categories(*))")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      ...data,
      categories: (data.brand_categories ?? []).map((bc: any) => bc.category).filter(Boolean),
    };
  } catch (err) {
    console.error("[getBrandBySlug]", err);
    return null;
  }
}

export interface ProductFilters {
  categorySlug?: string;
  brandSlug?: string;
  search?: string;
  limit?: number;
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductWithRelations[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("products")
      .select(
        "*, brand:brands(*), product_categories(category:categories(*)), product_images(*)"
      )
      .eq("status", "published")
      .order("display_order", { ascending: true });

    if (filters.brandSlug) {
      const { data: brand } = await supabase
        .from("brands")
        .select("id")
        .eq("slug", filters.brandSlug)
        .maybeSingle();
      if (!brand) return [];
      query = query.eq("brand_id", brand.id);
    }

    if (filters.search) {
      query = query.or(
        `name_en.ilike.%${filters.search}%,name_ar.ilike.%${filters.search}%`
      );
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    let results = (data ?? []).map((p: any) => ({
      ...p,
      categories: (p.product_categories ?? []).map((pc: any) => pc.category).filter(Boolean),
      images: (p.product_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order),
    })) as ProductWithRelations[];

    if (filters.categorySlug) {
      results = results.filter((p) =>
        p.categories.some((c) => c.slug === filters.categorySlug)
      );
    }

    return results;
  } catch (err) {
    console.error("[getProducts]", err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        "*, brand:brands(*), product_categories(category:categories(*)), product_images(*)"
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      ...data,
      categories: (data.product_categories ?? []).map((pc: any) => pc.category).filter(Boolean),
      images: (data.product_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order),
    };
  } catch (err) {
    console.error("[getProductBySlug]", err);
    return null;
  }
}

export async function getRelatedProducts(product: ProductWithRelations, count = 4): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("brand_id", product.brand_id)
      .eq("status", "published")
      .neq("id", product.id)
      .order("display_order", { ascending: true })
      .limit(count);
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("[getRelatedProducts]", err);
    return [];
  }
}

export async function getPage(slug: string): Promise<PageContent | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  } catch (err) {
    console.error("[getPage]", err);
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  } catch (err) {
    console.error("[getSiteSettings]", err);
    return null;
  }
}

/** Fallback settings used whenever Supabase is unreachable/unconfigured,
 * so the public site (WhatsApp button, footer, contact page) still
 * renders correct, brief-approved values during local development. */
export const FALLBACK_SETTINGS: SiteSettings = {
  id: 1,
  whatsapp_number: "971505023438",
  call_number: "+971505044805",
  email: "info@goldgravityuae.com",
  working_hours_en: "Monday–Saturday, 8:00 AM–6:00 PM. Sunday: Closed",
  working_hours_ar: "الإثنين–السبت، 8:00 صباحًا–6:00 مساءً. الأحد: مغلق",
  address_en: null,
  address_ar: null,
  google_maps_embed: null,
  social_instagram: null,
  social_facebook: null,
  social_linkedin: null,
  social_x: null,
  default_seo_title_en: "Gold Gravity Trading LLC | Food & Consumer Products Distributor UAE",
  default_seo_title_ar: "جولد جرافيتي للتجارة | موزع منتجات غذائية واستهلاكية في الإمارات",
  default_seo_description_en:
    "Gold Gravity Trading LLC supplies and distributes food, snacks, confectionery, seasonings, plastic and household products across the UAE, serving a growing network of 400+ clients.",
  default_seo_description_ar:
    "شركة جولد جرافيتي للتجارة توفر وتوزع المنتجات الغذائية والوجبات الخفيفة والحلويات والمنكهات والمنتجات البلاستيكية والمنزلية في جميع أنحاء الإمارات.",
  ga_measurement_id: null,
  logo_url: "/images/logos/gold-gravity-logo.jpeg",
  updated_at: new Date().toISOString(),
};
