import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

// Note: Next.js requires not-found.tsx to work without dynamic params,
// so this uses English/Arabic-neutral fallback copy. Locale-aware 404
// handling for known-bad locale-prefixed routes is covered by each
// route segment's own notFound() calls, which do have access to params.
export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center section-y">
      <Container className="max-w-lg text-center">
        <p className="font-serif text-7xl font-semibold text-champagne-dark">404</p>
        <h1 className="mt-4 font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
          Page Not Found / الصفحة غير موجودة
        </h1>
        <p className="mt-3 text-sm sm:text-base text-charcoal/60">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/en">Back to Homepage</Button>
          <Button href="/ar" variant="outline">
            الرئيسية
          </Button>
        </div>
      </Container>
    </section>
  );
}
