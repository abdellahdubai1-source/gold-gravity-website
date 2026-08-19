import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

export function FormField({
  label,
  error,
  required,
  className,
  children,
  hint,
}: {
  label: string;
  error?: FieldError;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-charcoal">
        {label}
        {required && <span className="text-champagne-dark"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-charcoal/45">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error.message || "This field is required"}</p>}
    </div>
  );
}

const baseInputClasses =
  "w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-charcoal/35 focus:border-champagne";

export const FormInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(baseInputClasses, className)} {...props} />
  )
);
FormInput.displayName = "FormInput";

export const FormTextarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(baseInputClasses, "resize-none", className)} {...props} />
  )
);
FormTextarea.displayName = "FormTextarea";

export const FormSelect = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(baseInputClasses, "appearance-none bg-no-repeat", className)} {...props}>
      {children}
    </select>
  )
);
FormSelect.displayName = "FormSelect";
