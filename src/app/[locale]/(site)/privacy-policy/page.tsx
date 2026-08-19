import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy | Gold Gravity Trading LLC",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage({ params }: { params: { locale: Locale } }) {
  const dict = getDictionary(params.locale);
  const isAr = params.locale === "ar";

  return (
    <section className="section-y !pt-12 sm:!pt-16">
      <Container className="max-w-3xl">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal gold-underline pb-4 mb-8">
          {dict.footer.privacy}
        </h1>

        <div className="mb-10 rounded-xl border border-champagne/40 bg-champagne/10 px-5 py-4 text-sm leading-relaxed text-charcoal/70">
          {isAr
            ? "هذا النص نموذج مبدئي معد من قبل فريق التطوير ولم يتم اعتماده قانونيًا بعد. يجب مراجعته من قبل جهة قانونية مختصة قبل اعتباره نهائيًا."
            : "This page is a reasonable starting template prepared by the development team. It has not yet been legally reviewed or approved by Gold Gravity Trading LLC or outside counsel — please treat it as provisional until reviewed."}
        </div>

        <div className="prose-content space-y-6 text-sm sm:text-base leading-relaxed text-charcoal/75">
          <p>
            {isAr
              ? "تحترم شركة Gold Gravity Trading LLC خصوصية زوار موقعها الإلكتروني. توضح هذه السياسة كيفية جمعنا واستخدامنا وحماية أي معلومات تقدمها عند استخدام موقعنا، بما في ذلك عبر نماذج طلب عرض السعر، الشراكة، والتواصل."
              : "Gold Gravity Trading LLC respects the privacy of visitors to this website. This policy explains how we collect, use and protect any information you provide when using our site, including through the Request a Quote, Partnership and Contact forms."}
          </p>
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            {isAr ? "المعلومات التي نجمعها" : "Information We Collect"}
          </h2>
          <p>
            {isAr
              ? "عند تعبئة أحد نماذجنا، قد نجمع معلومات مثل اسم الشركة، اسم الشخص المسؤول، رقم الهاتف، البريد الإلكتروني، وتفاصيل الاستفسار التجاري ذات الصلة."
              : "When you complete one of our forms, we may collect information such as company name, contact person, phone number, email address and relevant business inquiry details."}
          </p>
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            {isAr ? "كيفية استخدام المعلومات" : "How We Use Information"}
          </h2>
          <p>
            {isAr
              ? "نستخدم المعلومات المقدمة للرد على استفساراتك، معالجة طلبات عروض الأسعار، تقييم فرص الشراكة، والتواصل معك بخصوص منتجاتنا وخدماتنا."
              : "We use the information you provide to respond to your inquiries, process quote requests, evaluate partnership opportunities, and communicate with you about our products and services."}
          </p>
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            {isAr ? "حماية البيانات" : "Data Protection"}
          </h2>
          <p>
            {isAr
              ? "نتخذ إجراءات معقولة لحماية معلوماتك من الوصول غير المصرح به أو الفقدان أو سوء الاستخدام."
              : "We take reasonable measures to protect your information from unauthorized access, loss or misuse."}
          </p>
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            {isAr ? "التواصل معنا" : "Contact Us"}
          </h2>
          <p>
            {isAr
              ? "لأي استفسار متعلق بالخصوصية، يرجى التواصل معنا عبر info@goldgravityuae.com."
              : "For any privacy-related questions, please contact us at info@goldgravityuae.com."}
          </p>
        </div>
      </Container>
    </section>
  );
}
