"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { saveCategory, type CategoryInput } from "@/lib/actions/admin";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export function CategoryEditor({ locale, initial }: { locale: string; initial?: Partial<CategoryInput> & { id?: string } }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CategoryInput>({
    id: initial?.id,
    slug: initial?.slug ?? "",
    name_en: initial?.name_en ?? "",
    name_ar: initial?.name_ar ?? "",
    description_en: initial?.description_en ?? "",
    description_ar: initial?.description_ar ?? "",
    image_url: initial?.image_url ?? "",
    display_order: initial?.display_order ?? 0,
    seo_title_en: initial?.seo_title_en ?? "",
    seo_title_ar: initial?.seo_title_ar ?? "",
    seo_description_en: initial?.seo_description_en ?? "",
    seo_description_ar: initial?.seo_description_ar ?? "",
    is_published: initial?.is_published ?? true,
  });

  function set<K extends keyof CategoryInput>(key: K, value: CategoryInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const result = await saveCategory(form);
    setSaving(false);
    if (result.success) {
      toast.success("Category saved.");
      router.push(`/${locale}/admin/categories`);
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
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Name (English) *</label>
            <input value={form.name_en} onChange={(e) => set("name_en", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Name (Arabic) *</label>
            <input dir="rtl" value={form.name_ar} onChange={(e) => set("name_ar", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">URL Slug</label>
            <input value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Display Order</label>
            <input type="number" value={form.display_order} onChange={(e) => set("display_order", Number(e.target.value))} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Description (English)</label>
            <textarea rows={3} value={form.description_en ?? ""} onChange={(e) => set("description_en", e.target.value)} className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Description (Arabic)</label>
            <textarea dir="rtl" rows={3} value={form.description_ar ?? ""} onChange={(e) => set("description_ar", e.target.value)} className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-slate-700">Category Image</h2>
        <ImageUploadField label="Image" value={form.image_url} onChange={(url) => set("image_url", url)} hint="Used on the homepage category grid." />
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
          <button type="button" onClick={() => router.push(`/${locale}/admin/categories`)} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
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
