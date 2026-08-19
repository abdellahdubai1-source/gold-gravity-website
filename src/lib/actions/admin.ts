"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus, ProductStatus } from "@/types/database";

type Result = { success: true; id?: string } | { success: false; error: string };

async function uniqueSlug(
  table: "categories" | "brands" | "products",
  base: string,
  excludeId?: string
): Promise<string> {
  const supabase = createClient();
  const baseSlug = slugify(base, { lower: true, strict: true });
  let candidate = baseSlug;
  let n = 1;
  // Loop is bounded by number of collisions, which will be small in
  // practice (a handful of similarly-named products at most).
  while (true) {
    let query = supabase.from(table).select("id").eq("slug", candidate).limit(1);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query;
    if (!data || data.length === 0) return candidate;
    n += 1;
    candidate = `${baseSlug}-${n}`;
  }
}

function revalidatePublic() {
  revalidatePath("/en", "layout");
  revalidatePath("/ar", "layout");
}

// ---------------------------------------------------------------------
// CATEGORIES
// ---------------------------------------------------------------------
export interface CategoryInput {
  id?: string;
  slug?: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  image_url?: string;
  display_order?: number;
  seo_title_en?: string;
  seo_title_ar?: string;
  seo_description_en?: string;
  seo_description_ar?: string;
  is_published?: boolean;
}

export async function saveCategory(input: CategoryInput): Promise<Result> {
  try {
    const supabase = createClient();
    const slug = input.slug?.trim()
      ? slugify(input.slug, { lower: true, strict: true })
      : await uniqueSlug("categories", input.name_en, input.id);

    const row = { ...input, slug };
    delete (row as any).id;

    if (input.id) {
      const { error } = await supabase.from("categories").update(row).eq("id", input.id);
      if (error) throw error;
      revalidatePublic();
      return { success: true, id: input.id };
    } else {
      const { data, error } = await supabase.from("categories").insert(row).select("id").single();
      if (error) throw error;
      revalidatePublic();
      return { success: true, id: data.id };
    }
  } catch (err: any) {
    console.error("[saveCategory]", err);
    return { success: false, error: err.message ?? "Could not save category." };
  }
}

export async function deleteCategory(id: string): Promise<Result> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    revalidatePublic();
    return { success: true };
  } catch (err: any) {
    console.error("[deleteCategory]", err);
    return {
      success: false,
      error: "Could not delete this category — it may still be linked to brands or products.",
    };
  }
}

// ---------------------------------------------------------------------
// BRANDS
// ---------------------------------------------------------------------
export interface BrandInput {
  id?: string;
  slug?: string;
  name: string;
  brand_line_en?: string;
  brand_line_ar?: string;
  description_en?: string;
  description_ar?: string;
  logo_url?: string;
  hero_image_url?: string;
  country_of_origin?: string;
  display_order?: number;
  seo_title_en?: string;
  seo_title_ar?: string;
  seo_description_en?: string;
  seo_description_ar?: string;
  is_published?: boolean;
  category_ids: string[];
}

export async function saveBrand(input: BrandInput): Promise<Result> {
  try {
    const supabase = createClient();
    const { category_ids, ...rest } = input;
    const slug = rest.slug?.trim()
      ? slugify(rest.slug, { lower: true, strict: true })
      : await uniqueSlug("brands", rest.name, rest.id);

    const row = { ...rest, slug };
    delete (row as any).id;

    let brandId = input.id;
    if (brandId) {
      const { error } = await supabase.from("brands").update(row).eq("id", brandId);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from("brands").insert(row).select("id").single();
      if (error) throw error;
      brandId = data.id;
    }

    await supabase.from("brand_categories").delete().eq("brand_id", brandId);
    if (category_ids.length) {
      const { error } = await supabase
        .from("brand_categories")
        .insert(category_ids.map((category_id) => ({ brand_id: brandId, category_id })));
      if (error) throw error;
    }

    revalidatePublic();
    return { success: true, id: brandId };
  } catch (err: any) {
    console.error("[saveBrand]", err);
    return { success: false, error: err.message ?? "Could not save brand." };
  }
}

export async function deleteBrand(id: string): Promise<Result> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) throw error;
    revalidatePublic();
    return { success: true };
  } catch (err: any) {
    console.error("[deleteBrand]", err);
    return {
      success: false,
      error: "Could not delete this brand — remove or reassign its products first.",
    };
  }
}

// ---------------------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------------------
export interface ProductInput {
  id?: string;
  slug?: string;
  brand_id: string;
  name_en: string;
  name_ar: string;
  short_description_en?: string;
  short_description_ar?: string;
  country_of_origin?: string;
  size_label?: string;
  carton_qty?: string;
  barcode?: string;
  main_image_url?: string;
  status: ProductStatus;
  display_order?: number;
  seo_title_en?: string;
  seo_title_ar?: string;
  seo_description_en?: string;
  seo_description_ar?: string;
  category_ids: string[];
  gallery_images?: { image_url: string; alt_text_en?: string; alt_text_ar?: string }[];
}

export async function saveProduct(input: ProductInput): Promise<Result> {
  try {
    const supabase = createClient();
    const { category_ids, gallery_images, ...rest } = input;
    const slug = rest.slug?.trim()
      ? slugify(rest.slug, { lower: true, strict: true })
      : await uniqueSlug("products", rest.name_en, rest.id);

    const row = { ...rest, slug };
    delete (row as any).id;

    let productId = input.id;
    if (productId) {
      const { error } = await supabase.from("products").update(row).eq("id", productId);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from("products").insert(row).select("id").single();
      if (error) throw error;
      productId = data.id;
    }

    await supabase.from("product_categories").delete().eq("product_id", productId);
    if (category_ids.length) {
      const { error } = await supabase
        .from("product_categories")
        .insert(category_ids.map((category_id) => ({ product_id: productId, category_id })));
      if (error) throw error;
    }

    if (gallery_images) {
      await supabase.from("product_images").delete().eq("product_id", productId);
      if (gallery_images.length) {
        const { error } = await supabase.from("product_images").insert(
          gallery_images.map((img, i) => ({ ...img, product_id: productId, sort_order: i }))
        );
        if (error) throw error;
      }
    }

    revalidatePublic();
    return { success: true, id: productId };
  } catch (err: any) {
    console.error("[saveProduct]", err);
    return { success: false, error: err.message ?? "Could not save product." };
  }
}

export async function deleteProduct(id: string): Promise<Result> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    revalidatePublic();
    return { success: true };
  } catch (err: any) {
    console.error("[deleteProduct]", err);
    return { success: false, error: "Could not delete this product." };
  }
}

// ---------------------------------------------------------------------
// LEAD STATUS UPDATES (quotes / partnerships / contacts)
// ---------------------------------------------------------------------
export async function updateLeadStatus(
  table: "quote_requests" | "partnership_submissions" | "contact_submissions",
  id: string,
  status: LeadStatus
): Promise<Result> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) throw error;
    revalidatePath(`/en/admin`, "layout");
    return { success: true };
  } catch (err: any) {
    console.error("[updateLeadStatus]", err);
    return { success: false, error: "Could not update status." };
  }
}

// ---------------------------------------------------------------------
// SITE SETTINGS
// ---------------------------------------------------------------------
export async function saveSiteSettings(input: Record<string, unknown>): Promise<Result> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("site_settings").update(input).eq("id", 1);
    if (error) throw error;
    revalidatePublic();
    return { success: true };
  } catch (err: any) {
    console.error("[saveSiteSettings]", err);
    return { success: false, error: err.message ?? "Could not save settings." };
  }
}

// ---------------------------------------------------------------------
// PAGE CONTENT
// ---------------------------------------------------------------------
export async function savePageContent(
  slug: string,
  content: Record<string, unknown>,
  seo: {
    title_en?: string;
    title_ar?: string;
    seo_title_en?: string;
    seo_title_ar?: string;
    seo_description_en?: string;
    seo_description_ar?: string;
  }
): Promise<Result> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("pages")
      .upsert({ slug, content, ...seo }, { onConflict: "slug" });
    if (error) throw error;
    revalidatePublic();
    return { success: true };
  } catch (err: any) {
    console.error("[savePageContent]", err);
    return { success: false, error: err.message ?? "Could not save page content." };
  }
}
