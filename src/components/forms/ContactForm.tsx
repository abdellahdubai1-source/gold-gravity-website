"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation";
import { submitContactMessage } from "@/lib/actions/forms";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionaries";
import { Button } from "@/components/ui/Button";
import { FormField, FormInput, FormTextarea } from "@/components/forms/FormField";

export function ContactForm({ locale, dict }: { locale: Locale; dict: Messages }) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { locale },
  });

  async function onSubmit(values: ContactFormValues) {
    const result = await submitContactMessage({ ...values, locale });
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
        <h3 className="mt-5 font-serif text-2xl font-semibold text-charcoal">{dict.contact.success.heading}</h3>
        <p className="mt-2 max-w-md text-sm text-charcoal/60">{dict.contact.success.text}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 sm:grid-cols-2" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />

      <FormField label={dict.contact.fields.name} error={errors.name} required>
        <FormInput {...register("name")} />
      </FormField>
      <FormField label={dict.contact.fields.email} error={errors.email} required>
        <FormInput type="email" {...register("email")} />
      </FormField>
      <FormField label={dict.contact.fields.phone} error={errors.phone}>
        <FormInput type="tel" {...register("phone")} />
      </FormField>
      <FormField label={dict.contact.fields.subject} error={errors.subject}>
        <FormInput {...register("subject")} />
      </FormField>
      <FormField label={dict.contact.fields.message} error={errors.message} required className="sm:col-span-2">
        <FormTextarea rows={5} {...register("message")} />
      </FormField>

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? dict.common.submitting : dict.common.submit}
        </Button>
      </div>
    </form>
  );
}
