"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { saveProduct, type ProductInput } from "@/lib/actions/admin";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { GalleryUploadField, type GalleryImage } from "@/components/admin/GalleryUploadField";

interface Category {
  id: string;
  name_en: string;
}
interface Brand {
  id: string;
  name: string;
}

export function ProductEditor({
  locale,
  categories,
  brands,
  initial,
}: {
  locale: string;
  categories: Category[];
  brands: Brand[];
  initial?: Partial<ProductInput> & { id?: string; images?: GalleryImage[] };
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProductInput>({
    id: initial?.id,
    slug: initial?.slug ?? "",
    brand_id: initial?.brand_id ?? brands[0]?.id ?? "",
    name_en: initial?.name_en ?? "",
    name_ar: initial?.name_ar ?? "",
    short_description_en: initial?.short_description_en ?? "",
    short_description_ar: initial?.short_description_ar ?? "",
    country_of_origin: initial?.country_of_origin ?? "",
    size_label: initial?.size_label ?? "",
    carton_qty: initial?.carton_qty ?? "",
    barcode: initial?.barcode ?? "",
    main_image_url: initial?.main_image_url ?? "",
    status: initial?.status ?? "draft",
    display_order: initial?.display_order ?? 0,
    seo_title_en: initial?.seo_title_en ?? "",
    seo_title_ar: initial?.seo_title_ar ?? "",
    seo_description_en: initial?.seo_description_en ?? "",
    seo_description_ar: initial?.seo_description_ar ?? "",
    category_ids: initial?.category_ids ?? [],
  });
  const [gallery, setGallery] = useState<GalleryImage[]>(initial?.images ?? []);

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleCategory(id: string) {
    setForm((f) => ({
      ...f,
      category_ids: f.category_ids.includes(id)
        ? f.category_ids.filter((c) => c !== id)
        : [...f.category_ids, id],
    }));
  }

  async function handleSave(status?: "draft" | "published") {
    setSaving(true);
    const payload: ProductInput = {
      ...form,
      status: status ?? form.status,
      gallery_images: gallery,
    };
    const result = await saveProduct(payload);
    setSaving(false);
    if (result.success) {
      toast.success("Product saved.");
      router.push(`/${locale}/admin/products`);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-8">
      <Section title="Basic Information">
        <Grid>
          <Field label="Product Name (English)" required>
            <Input value={form.name_en} onChange={(v) => set("name_en", v)} />
          </Field>
          <Field label="Product Name (Arabic)" required>
            <Input dir="rtl" value={form.name_ar} onChange={(v) => set("name_ar", v)} />
          </Field>
          <Field label="Brand" required>
            <Select value={form.brand_id} onChange={(v) => set("brand_id", v)}>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="URL Slug" hint="Leave blank to auto-generate from the English name.">
            <Input value={form.slug ?? ""} onChange={(v) => set("slug", v)} placeholder="auto-generated" />
          </Field>
          <Field label="Description (English)" className="sm:col-span-2">
            <Textarea value={form.short_description_en ?? ""} onChange={(v) => set("short_description_en", v)} />
          </Field>
          <Field label="Description (Arabic)" className="sm:col-span-2">
            <Textarea dir="rtl" value={form.short_description_ar ?? ""} onChange={(v) => set("short_description_ar", v)} />
          </Field>
        </Grid>
      </Section>

      <Section title="Categories">
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
      </Section>

      <Section title="Specifications">
        <Grid>
          <Field label="Country of Origin">
            <Input value={form.country_of_origin ?? ""} onChange={(v) => set("country_of_origin", v)} />
          </Field>
          <Field label="Size / Specification">
            <Input value={form.size_label ?? ""} onChange={(v) => set("size_label", v)} />
          </Field>
          <Field label="Carton Quantity">
            <Input value={form.carton_qty ?? ""} onChange={(v) => set("carton_qty", v)} />
          </Field>
          <Field label="Barcode">
            <Input value={form.barcode ?? ""} onChange={(v) => set("barcode", v)} />
          </Field>
        </Grid>
      </Section>

      <Section title="Images">
        <div className="space-y-6">
          <ImageUploadField
            label="Main Image"
            value={form.main_image_url}
            onChange={(url) => set("main_image_url", url)}
            hint="Shown on product cards and as the primary product photo."
          />
          <GalleryUploadField label="Additional Gallery Images" images={gallery} onChange={setGallery} />
        </div>
      </Section>

      <Section title="SEO">
        <Grid>
          <Field label="SEO Title (English)">
            <Input value={form.seo_title_en ?? ""} onChange={(v) => set("seo_title_en", v)} />
          </Field>
          <Field label="SEO Title (Arabic)">
            <Input dir="rtl" value={form.seo_title_ar ?? ""} onChange={(v) => set("seo_title_ar", v)} />
          </Field>
          <Field label="Meta Description (English)" className="sm:col-span-2">
            <Textarea value={form.seo_description_en ?? ""} onChange={(v) => set("seo_description_en", v)} />
          </Field>
          <Field label="Meta Description (Arabic)" className="sm:col-span-2">
            <Textarea dir="rtl" value={form.seo_description_ar ?? ""} onChange={(v) => set("seo_description_ar", v)} />
          </Field>
        </Grid>
      </Section>

      <div className="sticky bottom-0 -mx-5 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur lg:-mx-8 lg:px-8">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.status === "published"}
            onChange={(e) => set("status", e.target.checked ? "published" : "draft")}
            className="h-4 w-4 rounded border-slate-300 text-champagne-dark focus:ring-champagne"
          />
          Published (visible on the public website)
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push(`/${locale}/admin/products`)}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            className="flex items-center gap-2 rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium text-white hover:bg-charcoal/90 transition-colors disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Small local UI helpers (kept in-file since they're only used here
// and in the Brand/Category editors, which define their own copies to
// avoid a shared-state footgun across very different form shapes).
// ---------------------------------------------------------------------
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="mb-5 text-sm font-semibold text-slate-700">{title}</h2>
      {children}
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>;
}
function Field({
  label,
  required,
  hint,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
function Input({
  value,
  onChange,
  placeholder,
  dir,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  dir?: "rtl" | "ltr";
}) {
  return (
    <input
      value={value}
      dir={dir}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark"
    />
  );
}
function Textarea({ value, onChange, dir }: { value: string; onChange: (v: string) => void; dir?: "rtl" | "ltr" }) {
  return (
    <textarea
      value={value}
      dir={dir}
      rows={3}
      onChange={(e) => onChange(e.target.value)}
      className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark"
    />
  );
}
function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark"
    >
      {children}
    </select>
  );
}
