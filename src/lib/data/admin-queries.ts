import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin-facing queries run with the signed-in admin's own session
 * (not the service role), relying on the `is_admin()` RLS policies in
 * supabase/policies.sql to grant access to draft content and lead
 * tables. If a request somehow reaches these without an admin
 * session, RLS returns zero rows rather than an error.
 */

export async function getAllCategoriesAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase.from("categories").select("*").order("display_order");
  if (error) throw error;
  return data ?? [];
}

export async function getAllBrandsAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*, brand_categories(category_id)")
    .order("display_order");
  if (error) throw error;
  return (data ?? []).map((b: any) => ({
    ...b,
    category_ids: (b.brand_categories ?? []).map((bc: any) => bc.category_id),
  }));
}

export async function getAllProductsAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, brand:brands(id, name, slug), product_categories(category_id), product_images(*)")
    .order("display_order");
  if (error) throw error;
  return (data ?? []).map((p: any) => ({
    ...p,
    category_ids: (p.product_categories ?? []).map((pc: any) => pc.category_id),
  }));
}

export async function getProductByIdAdmin(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_categories(category_id), product_images(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    category_ids: (data.product_categories ?? []).map((pc: any) => pc.category_id),
    images: (data.product_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order),
  };
}

export async function getBrandByIdAdmin(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*, brand_categories(category_id)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { ...data, category_ids: (data.brand_categories ?? []).map((bc: any) => bc.category_id) };
}

export async function getCategoryByIdAdmin(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getDashboardCounts() {
  const supabase = createClient();
  const [products, categories, brands, quotes, partnerships, contacts] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("brands").select("id", { count: "exact", head: true }),
    supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("partnership_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);
  return {
    products: products.count ?? 0,
    categories: categories.count ?? 0,
    brands: brands.count ?? 0,
    newQuotes: quotes.count ?? 0,
    newPartnerships: partnerships.count ?? 0,
    newContacts: contacts.count ?? 0,
  };
}

export async function getQuoteRequestsAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quote_requests")
    .select("*, category:categories(name_en), brand:brands(name), product:products(name_en)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPartnershipSubmissionsAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("partnership_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getContactSubmissionsAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
