"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { savePageContent } from "@/lib/actions/admin";

export interface ContentFieldConfig {
  key: string; // dot-path within content, e.g. "hero.heading"
  label: string;
  type?: "text" | "textarea";
  bilingual?: boolean; // if true, renders _en/_ar pair
}

function getPath(obj: any, path: string) {
  return path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}
function setPath(obj: any, path: string, value: unknown) {
  const keys = path.split(".");
  const next = structuredClone(obj ?? {});
  let cursor = next;
  for (let i = 0; i < keys.length - 1; i++) {
    cursor[keys[i]] = cursor[keys[i]] ?? {};
    cursor = cursor[keys[i]];
  }
  cursor[keys[keys.length - 1]] = value;
  return next;
}

export function PageContentEditor({
  slug,
  initialContent,
  fields,
  seo,
}: {
  slug: string;
  initialContent: Record<string, unknown>;
  fields: ContentFieldConfig[];
  seo?: {
    seo_title_en?: string | null;
    seo_title_ar?: string | null;
    seo_description_en?: string | null;
    seo_description_ar?: string | null;
  };
}) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [seoForm, setSeoForm] = useState({
    seo_title_en: seo?.seo_title_en ?? "",
    seo_title_ar: seo?.seo_title_ar ?? "",
    seo_description_en: seo?.seo_description_en ?? "",
    seo_description_ar: seo?.seo_description_ar ?? "",
  });
  const [saving, setSaving] = useState(false);

  function updateField(path: string, value: string) {
    setContent((c) => setPath(c, path, value));
  }

  async function handleSave() {
    setSaving(true);
    const result = await savePageContent(slug, content, seoForm);
    setSaving(false);
    if (result.success) {
      toast.success("Page content saved.");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-slate-700">Content</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {fields.map((f) =>
            f.bilingual ? (
              <BilingualPair key={f.key} field={f} content={content} onChange={updateField} />
            ) : (
              <div key={f.key} className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">{f.label}</label>
                <FieldInput type={f.type} value={(getPath(content, f.key) as string) ?? ""} onChange={(v) => updateField(f.key, v)} />
              </div>
            )
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-slate-700">SEO</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">SEO Title (English)</label>
            <input
              value={seoForm.seo_title_en}
              onChange={(e) => setSeoForm((s) => ({ ...s, seo_title_en: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">SEO Title (Arabic)</label>
            <input
              dir="rtl"
              value={seoForm.seo_title_ar}
              onChange={(e) => setSeoForm((s) => ({ ...s, seo_title_ar: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Meta Description (English)</label>
            <textarea
              rows={2}
              value={seoForm.seo_description_en}
              onChange={(e) => setSeoForm((s) => ({ ...s, seo_description_en: e.target.value }))}
              className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark"
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-5 flex justify-end border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur lg:-mx-8 lg:px-8">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="flex items-center gap-2 rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium text-white hover:bg-charcoal/90 transition-colors disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}

function BilingualPair({
  field,
  content,
  onChange,
}: {
  field: ContentFieldConfig;
  content: Record<string, unknown>;
  onChange: (path: string, value: string) => void;
}) {
  return (
    <>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">{field.label} (English)</label>
        <FieldInput type={field.type} value={(getPath(content, `${field.key}_en`) as string) ?? ""} onChange={(v) => onChange(`${field.key}_en`, v)} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">{field.label} (Arabic)</label>
        <FieldInput dir="rtl" type={field.type} value={(getPath(content, `${field.key}_ar`) as string) ?? ""} onChange={(v) => onChange(`${field.key}_ar`, v)} />
      </div>
    </>
  );
}

function FieldInput({
  type = "text",
  value,
  onChange,
  dir,
}: {
  type?: "text" | "textarea";
  value: string;
  onChange: (v: string) => void;
  dir?: "rtl" | "ltr";
}) {
  if (type === "textarea") {
    return (
      <textarea
        dir={dir}
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark"
      />
    );
  }
  return (
    <input
      dir={dir}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-champagne-dark"
    />
  );
}
