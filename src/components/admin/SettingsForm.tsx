"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { saveSiteSettings } from "@/lib/actions/admin";
import type { SiteSettings } from "@/types/database";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    whatsapp_number: initial.whatsapp_number,
    call_number: initial.call_number,
    email: initial.email,
    working_hours_en: initial.working_hours_en,
    working_hours_ar: initial.working_hours_ar,
    address_en: initial.address_en ?? "",
    address_ar: initial.address_ar ?? "",
    google_maps_embed: initial.google_maps_embed ?? "",
    social_instagram: initial.social_instagram ?? "",
    social_facebook: initial.social_facebook ?? "",
    social_linkedin: initial.social_linkedin ?? "",
    default_seo_title_en: initial.default_seo_title_en ?? "",
    default_seo_title_ar: initial.default_seo_title_ar ?? "",
    default_seo_description_en: initial.default_seo_description_en ?? "",
    default_seo_description_ar: initial.default_seo_description_ar ?? "",
    ga_measurement_id: initial.ga_measurement_id ?? "",
    logo_url: initial.logo_url ?? "",
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const result = await saveSiteSettings(form);
    setSaving(false);
    if (result.success) toast.success("Settings saved.");
    else toast.error(result.error);
  }

  return (
    <div className="space-y-6">
      <Section title="Contact Details" description="Shown in the header, footer, contact page and WhatsApp button.">
        <Grid>
          <Field label="WhatsApp Number" hint="Digits only, with country code, e.g. 971505023438">
            <Input value={form.whatsapp_number} onChange={(v) => set("whatsapp_number", v)} />
          </Field>
          <Field label="Main Call Number">
            <Input value={form.call_number} onChange={(v) => set("call_number", v)} />
          </Field>
          <Field label="Email">
            <Input value={form.email} onChange={(v) => set("email", v)} />
          </Field>
          <Field label="Working Hours (English)">
            <Input value={form.working_hours_en} onChange={(v) => set("working_hours_en", v)} />
          </Field>
          <Field label="Working Hours (Arabic)">
            <Input dir="rtl" value={form.working_hours_ar} onChange={(v) => set("working_hours_ar", v)} />
          </Field>
        </Grid>
      </Section>

      <Section title="Address & Map" description="Currently pending client confirmation — safe to leave blank.">
        <Grid>
          <Field label="Address (English)">
            <Input value={form.address_en} onChange={(v) => set("address_en", v)} />
          </Field>
          <Field label="Address (Arabic)">
            <Input dir="rtl" value={form.address_ar} onChange={(v) => set("address_ar", v)} />
          </Field>
          <Field label="Google Maps Embed Code" className="sm:col-span-2" hint="Paste the full <iframe> embed code from Google Maps.">
            <Textarea value={form.google_maps_embed} onChange={(v) => set("google_maps_embed", v)} />
          </Field>
        </Grid>
      </Section>

      <Section title="Social Links" description="Leave blank until the client provides confirmed accounts.">
        <Grid>
          <Field label="Instagram URL">
            <Input value={form.social_instagram} onChange={(v) => set("social_instagram", v)} />
          </Field>
          <Field label="Facebook URL">
            <Input value={form.social_facebook} onChange={(v) => set("social_facebook", v)} />
          </Field>
          <Field label="LinkedIn URL">
            <Input value={form.social_linkedin} onChange={(v) => set("social_linkedin", v)} />
          </Field>
        </Grid>
      </Section>

      <Section title="Default SEO">
        <Grid>
          <Field label="Default SEO Title (English)">
            <Input value={form.default_seo_title_en} onChange={(v) => set("default_seo_title_en", v)} />
          </Field>
          <Field label="Default SEO Title (Arabic)">
            <Input dir="rtl" value={form.default_seo_title_ar} onChange={(v) => set("default_seo_title_ar", v)} />
          </Field>
          <Field label="Default Meta Description (English)" className="sm:col-span-2">
            <Textarea value={form.default_seo_description_en} onChange={(v) => set("default_seo_description_en", v)} />
          </Field>
          <Field label="Default Meta Description (Arabic)" className="sm:col-span-2">
            <Textarea dir="rtl" value={form.default_seo_description_ar} onChange={(v) => set("default_seo_description_ar", v)} />
          </Field>
        </Grid>
      </Section>

      <Section title="Analytics" description="Add a company-owned Google Analytics Measurement ID when available.">
        <Field label="GA Measurement ID">
          <Input value={form.ga_measurement_id} onChange={(v) => set("ga_measurement_id", v)} placeholder="G-XXXXXXXXXX" />
        </Field>
      </Section>

      <Section title="Logo">
        <ImageUploadField label="Site Logo" value={form.logo_url} onChange={(url) => set("logo_url", url)} />
      </Section>

      <div className="sticky bottom-0 -mx-5 flex justify-end border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur lg:-mx-8 lg:px-8">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="flex items-center gap-2 rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium text-white hover:bg-charcoal/90 transition-colors disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Settings
        </button>
      </div>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>;
}
function Field({ label, hint, className, children }: { label: string; hint?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
function Input({ value, onChange, placeholder, dir }: { value: string; onChange: (v: string) => void; placeholder?: string; dir?: "rtl" | "ltr" }) {
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
