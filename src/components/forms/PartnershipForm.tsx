"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { CheckCircle2, UploadCloud, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { partnershipFormSchema, type PartnershipFormValues } from "@/lib/validation";
import { submitPartnershipRequest } from "@/lib/actions/forms";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionaries";
import { Button } from "@/components/ui/Button";
import { FormField, FormInput, FormTextarea } from "@/components/forms/FormField";

const MAX_FILES = 5;
const MAX_SIZE_MB = 10;

export function PartnershipForm({ locale, dict }: { locale: Locale; dict: Messages }) {
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PartnershipFormValues>({
    resolver: zodResolver(partnershipFormSchema),
    defaultValues: { locale },
  });

  function handleFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list).filter((f) => f.size <= MAX_SIZE_MB * 1024 * 1024);
    if (incoming.length < list.length) {
      toast.error(`Some files were skipped — max ${MAX_SIZE_MB}MB per file.`);
    }
    setFiles((prev) => [...prev, ...incoming].slice(0, MAX_FILES));
  }

  async function onSubmit(values: PartnershipFormValues) {
    setUploading(true);
    const uploaded: { name: string; url: string }[] = [];
    try {
      if (files.length) {
        const supabase = createClient();
        for (const file of files) {
          const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
          const { error } = await supabase.storage.from("partnership-uploads").upload(path, file);
          if (error) {
            console.error("[upload]", error);
            toast.error(`Could not upload ${file.name}.`);
            continue;
          }
          const { data } = supabase.storage.from("partnership-uploads").getPublicUrl(path);
          uploaded.push({ name: file.name, url: data.publicUrl });
        }
      }
    } finally {
      setUploading(false);
    }

    const result = await submitPartnershipRequest({ ...values, locale }, uploaded);
    if (result.success) {
      setSubmitted(true);
    } else {
      toast.error(result.error);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-champagne/30 bg-champagne/10 px-6 py-16 text-center">
        <CheckCircle2 className="h-12 w-12 text-champagne-dark" />
        <h3 className="mt-5 font-serif text-2xl font-semibold text-charcoal">{dict.partnership.success.heading}</h3>
        <p className="mt-2 max-w-md text-sm text-charcoal/60">{dict.partnership.success.text}</p>
      </div>
    );
  }

  const busy = isSubmitting || uploading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 sm:grid-cols-2" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />

      <FormField label={dict.partnership.fields.companyName} error={errors.company_name} required>
        <FormInput {...register("company_name")} />
      </FormField>
      <FormField label={dict.partnership.fields.contactPerson} error={errors.contact_person} required>
        <FormInput {...register("contact_person")} />
      </FormField>
      <FormField label={dict.partnership.fields.country} error={errors.country} required>
        <FormInput {...register("country")} />
      </FormField>
      <FormField label={dict.partnership.fields.phone} error={errors.phone} required>
        <FormInput type="tel" placeholder="+971 5X XXX XXXX" {...register("phone")} />
      </FormField>
      <FormField label={dict.partnership.fields.email} error={errors.email}>
        <FormInput type="email" {...register("email")} />
      </FormField>
      <FormField label={dict.partnership.fields.brandName} error={errors.brand_name}>
        <FormInput {...register("brand_name")} />
      </FormField>
      <FormField label={dict.partnership.fields.productCategory} error={errors.product_category}>
        <FormInput {...register("product_category")} />
      </FormField>
      <FormField label={dict.partnership.fields.countryOfOrigin} error={errors.country_of_origin}>
        <FormInput {...register("country_of_origin")} />
      </FormField>
      <FormField label={dict.partnership.fields.companyWebsite} error={errors.company_website} className="sm:col-span-2">
        <FormInput placeholder="https://" {...register("company_website")} />
      </FormField>
      <FormField label={dict.partnership.fields.message} error={errors.message} className="sm:col-span-2">
        <FormTextarea rows={4} {...register("message")} />
      </FormField>

      <div className="sm:col-span-2">
        <label className="text-sm font-medium text-charcoal">{dict.partnership.fields.catalogue}</label>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          className="mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-charcoal/20 bg-beige/40 px-6 py-10 text-center transition-colors hover:border-champagne"
        >
          <UploadCloud className="h-7 w-7 text-champagne-dark" />
          <p className="text-sm text-charcoal/60">
            {dict.partnership.fields.catalogueHint}
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
        {files.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {files.map((f, i) => (
              <li key={i} className="flex items-center gap-2 rounded-full bg-beige px-3 py-1.5 text-xs text-charcoal/70">
                <FileText className="h-3.5 w-3.5 text-champagne-dark" />
                <span className="max-w-[10rem] truncate">{f.name}</span>
                <button type="button" onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}>
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="sm:col-span-2 text-xs leading-relaxed text-charcoal/45">
        {dict.partnership.disclaimerLabel}: {locale === "ar"
          ? "تقديم الطلب لا يعني قبولًا تلقائيًا للتوزيع. تخضع جميع الفرص للمراجعة والاتفاق التجاري."
          : "Submission does not mean automatic acceptance for distribution. All opportunities are subject to review and commercial agreement."}
      </p>

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={busy} className="w-full sm:w-auto">
          {busy ? dict.common.submitting : dict.common.submit}
        </Button>
      </div>
    </form>
  );
}
