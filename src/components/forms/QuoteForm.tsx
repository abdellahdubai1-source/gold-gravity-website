"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { quoteFormSchema, type QuoteFormValues } from "@/lib/validation";
import { submitQuoteRequest } from "@/lib/actions/forms";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionaries";
import type { Category, BrandWithCategories, Product } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { FormField, FormInput, FormSelect, FormTextarea } from "@/components/forms/FormField";

const EMIRATES = [
  "abudhabi",
  "dubai",
  "sharjah",
  "ajman",
  "ummalquwain",
  "rasalkhaimah",
  "fujairah",
] as const;

const BUSINESS_TYPES = ["supermarket", "hypermarket", "wholesale", "store", "distributor", "other"] as const;

export function QuoteForm({
  locale,
  dict,
  categories,
  brands,
  products,
  initial,
}: {
  locale: Locale;
  dict: Messages;
  categories: Category[];
  brands: BrandWithCategories[];
  products: (Product & { brand_id: string })[];
  initial: { categoryId?: string; brandId?: string; productId?: string };
}) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      category_id: initial.categoryId ?? "",
      brand_id: initial.brandId ?? "",
      product_id: initial.productId ?? "",
      locale,
    },
  });

  const selectedBrandId = watch("brand_id");
  const filteredProducts = useMemo(
    () => (selectedBrandId ? products.filter((p) => p.brand_id === selectedBrandId) : products),
    [products, selectedBrandId]
  );

  async function onSubmit(values: QuoteFormValues) {
    const result = await submitQuoteRequest({ ...values, locale });
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
        <h3 className="mt-5 font-serif text-2xl font-semibold text-charcoal">{dict.quote.success.heading}</h3>
        <p className="mt-2 max-w-md text-sm text-charcoal/60">{dict.quote.success.text}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 sm:grid-cols-2" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />

      <FormField label={dict.quote.fields.companyName} error={errors.company_name} required>
        <FormInput {...register("company_name")} />
      </FormField>
      <FormField label={dict.quote.fields.contactPerson} error={errors.contact_person} required>
        <FormInput {...register("contact_person")} />
      </FormField>
      <FormField label={dict.quote.fields.phone} error={errors.phone} required>
        <FormInput type="tel" placeholder="+971 5X XXX XXXX" {...register("phone")} />
      </FormField>
      <FormField label={dict.quote.fields.email} error={errors.email}>
        <FormInput type="email" {...register("email")} />
      </FormField>
      <FormField label={dict.quote.fields.emirate} error={errors.emirate} required>
        <FormSelect {...register("emirate")}>
          <option value="">—</option>
          {EMIRATES.map((e) => (
            <option key={e} value={dict.quote.emirates[e]}>
              {dict.quote.emirates[e]}
            </option>
          ))}
        </FormSelect>
      </FormField>
      <FormField label={dict.quote.fields.businessType} error={errors.business_type}>
        <FormSelect {...register("business_type")}>
          <option value="">—</option>
          {BUSINESS_TYPES.map((b) => (
            <option key={b} value={dict.quote.businessTypes[b]}>
              {dict.quote.businessTypes[b]}
            </option>
          ))}
        </FormSelect>
      </FormField>
      <FormField label={dict.quote.fields.productCategory} error={errors.category_id}>
        <FormSelect {...register("category_id")}>
          <option value="">—</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {locale === "ar" ? c.name_ar : c.name_en}
            </option>
          ))}
        </FormSelect>
      </FormField>
      <FormField label={dict.quote.fields.brand} error={errors.brand_id}>
        <FormSelect
          {...register("brand_id")}
          onChange={(e) => {
            setValue("brand_id", e.target.value);
            setValue("product_id", "");
          }}
        >
          <option value="">—</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </FormSelect>
      </FormField>
      <FormField label={dict.quote.fields.product} error={errors.product_id} className="sm:col-span-2">
        <FormSelect {...register("product_id")}>
          <option value="">—</option>
          {filteredProducts.map((p) => (
            <option key={p.id} value={p.id}>
              {locale === "ar" ? p.name_ar : p.name_en}
            </option>
          ))}
        </FormSelect>
      </FormField>
      <FormField label={dict.quote.fields.quantity} error={errors.quantity}>
        <FormInput {...register("quantity")} />
      </FormField>
      <FormField label={dict.quote.fields.notes} error={errors.notes} className="sm:col-span-2">
        <FormTextarea rows={4} {...register("notes")} />
      </FormField>

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? dict.common.submitting : dict.common.submit}
        </Button>
      </div>
    </form>
  );
}
