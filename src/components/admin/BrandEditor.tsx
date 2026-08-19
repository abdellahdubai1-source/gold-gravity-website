"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { saveBrand, type BrandInput } from "@/lib/actions/admin";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

interface Category {
  id: string;
  name_en: string;
}

export function BrandEditor({
  locale,
  categories,
  initial,
}: {
  locale: string;
  categories: Category[];
  initial?: Partial<BrandInput> & { id?: string };
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BrandInput>({
    id: initial?.id,
    slug: initial?.slug ?? "",
    name: initial?.name ?? "",
    brand_line_en: initial?.brand_line_en ?? "",
    brand_line_ar: initial?.brand_line_ar ?? "",
    description_en: initial?.description_en ?? "",
    description_ar: initial?.description_ar ?? "",
    logo_url: initial?.logo_url ?? "",
    hero_image_url: initial?.hero_image_url ?? "",
    country_of_origin: initial?.country_of_origin ?? "",
    display_order: initial?.display_order ?? 0,
    seo_title_en: initial?.seo_title_en ?? "",
    seo_title_ar: initial?.seo_title_ar ?? "",
    seo_description_en: initial?.seo_description_en ?? "",
    seo_description_ar: initial?.seo_description_ar ?? "",
    is_published: initial?.is_published ?? true,
    category_ids: initial?.category_ids ?? [],
  });

  function set<K extends keyof BrandInput>(key: K, value: BrandInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleCategory(id: string) {
    setForm((f) => ({
      ...f,
      category_ids: f.category_ids.includes(id) ? f.category_ids.filter((c) => c !== id) : [...f.category_ids, id],
    }));
  }

  async function handleSave() {
    setSaving(true);
    const result = await saveBrand(form);
    setSaving(false);
    if (result.success) {
      toast.success("Brand saved.");
      router.push(`/${locale}/admin/brands`);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Brand Name *</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">URL Slug</label>
            <input value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Brand Line (English)</label>
            <input value={form.brand_line_en ?? ""} onChange={(e) => set("brand_line_en", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Brand Line (Arabic)</label>
            <input dir="rtl" value={form.brand_line_ar ?? ""} onChange={(e) => set("brand_line_ar", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Description (English)</label>
            <textarea rows={3} value={form.description_en ?? ""} onChange={(e) => set("description_en", e.target.value)} className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Description (Arabic)</label>
            <textarea dir="rtl" rows={3} value={form.description_ar ?? ""} onChange={(e) => set("description_ar", e.target.value)} className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Country of Origin</label>
            <input value={form.country_of_origin ?? ""} onChange={(e) => set("country_of_origin", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Display Order</label>
            <input type="number" value={form.display_order} onChange={(e) => set("display_order", Number(e.target.value))} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-slate-700">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCategory(c.id)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                form.category_ids.includes(c.id)
                  ? "border-champagne-dark bg-champagne-dark/10 text-champagne-dark"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {c.name_en}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">A brand may belong to more than one category.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-slate-700">Brand Imagery</h2>
        <div className="space-y-6">
          <ImageUploadField label="Logo" value={form.logo_url} onChange={(url) => set("logo_url", url)} hint="Displayed in the header, footer and brand card." />
          <ImageUploadField label="Hero / Brand Image" value={form.hero_image_url} onChange={(url) => set("hero_image_url", url)} hint="Shown on the brand's page." />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-slate-700">SEO</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">SEO Title (English)</label>
            <input value={form.seo_title_en ?? ""} onChange={(e) => set("seo_title_en", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">SEO Title (Arabic)</label>
            <input dir="rtl" value={form.seo_title_ar ?? ""} onChange={(e) => set("seo_title_ar", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Meta Description (English)</label>
            <textarea rows={2} value={form.seo_description_en ?? ""} onChange={(e) => set("seo_description_en", e.target.value)} className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-5 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur lg:-mx-8 lg:px-8">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-champagne-dark focus:ring-champagne" />
          Published
        </label>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.push(`/${locale}/admin/brands`)} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="button" disabled={saving} onClick={handleSave} className="flex items-center gap-2 rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium text-white hover:bg-charcoal/90 transition-colors disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
