import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms & Conditions | Gold Gravity Trading LLC",
  robots: { index: true, follow: true },
};

export default function TermsPage({ params }: { params: { locale: Locale } }) {
  const dict = getDictionary(params.locale);
  const isAr = params.locale === "ar";

  return (
    <section className="section-y !pt-12 sm:!pt-16">
      <Container className="max-w-3xl">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal gold-underline pb-4 mb-8">
          {dict.footer.terms}
        </h1>

        <div className="mb-10 rounded-xl border border-champagne/40 bg-champagne/10 px-5 py-4 text-sm leading-relaxed text-charcoal/70">
          {isAr
            ? "هذا النص نموذج مبدئي معد من قبل فريق التطوير ولم يتم اعتماده قانونيًا بعد. يجب مراجعته من قبل جهة قانونية مختصة قبل اعتباره نهائيًا."
            : "This page is a reasonable starting template prepared by the development team. It has not yet been legally reviewed or approved by Gold Gravity Trading LLC or outside counsel — please treat it as provisional until reviewed."}
        </div>

        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-charcoal/75">
          <p>
            {isAr
              ? "يشكل استخدامك لهذا الموقع الإلكتروني موافقة على الشروط والأحكام التالية. تُقدَّم المعلومات الواردة في هذا الموقع لأغراض تعريفية عامة عن منتجات وخدمات Gold Gravity Trading LLC."
              : "Your use of this website constitutes agreement to the following terms and conditions. The information on this site is provided for general informational purposes about Gold Gravity Trading LLC's products and services."}
          </p>
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            {isAr ? "لا توجد أسعار علنية" : "No Public Pricing"}
          </h2>
          <p>
            {isAr
              ? "هذا الموقع كتالوج تجاري لأغراض B2B وليس متجرًا إلكترونيًا. لا يتم عرض الأسعار علنًا؛ يتم توفير الأسعار عند الطلب بناءً على الكمية ونوع النشاط التجاري عبر نموذج طلب عرض السعر."
              : "This website is a B2B product catalogue and is not an e-commerce store. Prices are not displayed publicly; pricing is provided on request based on quantity and business type via the Request a Quote form."}
          </p>
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            {isAr ? "دقة المحتوى" : "Content Accuracy"}
          </h2>
          <p>
            {isAr
              ? "نبذل جهدًا معقولاً للحفاظ على دقة معلومات المنتجات، ولكن المواصفات قد تتغير دون إشعار مسبق. يرجى التأكيد مع فريق المبيعات لدينا قبل إتمام أي طلب."
              : "We make reasonable efforts to keep product information accurate, but specifications may change without prior notice. Please confirm with our sales team before finalizing any order."}
          </p>
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            {isAr ? "الملكية الفكرية" : "Intellectual Property"}
          </h2>
          <p>
            {isAr
              ? "جميع الشعارات والعلامات التجارية والصور المعروضة على هذا الموقع مملوكة لـ Gold Gravity Trading LLC أو لأصحابها المعنيين ولا يجوز استخدامها دون إذن."
              : "All logos, trademarks and imagery displayed on this site belong to Gold Gravity Trading LLC or their respective owners and may not be used without permission."}
          </p>
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            {isAr ? "التواصل معنا" : "Contact Us"}
          </h2>
          <p>
            {isAr
              ? "لأي استفسار متعلق بالشروط والأحكام، يرجى التواصل معنا عبر info@goldgravityuae.com."
              : "For any questions about these terms, please contact us at info@goldgravityuae.com."}
          </p>
        </div>
      </Container>
    </section>
  );
}
