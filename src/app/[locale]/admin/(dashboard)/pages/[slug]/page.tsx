import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PageContentEditor, type ContentFieldConfig } from "@/components/admin/PageContentEditor";

export const dynamic = "force-dynamic";

const FIELD_CONFIGS: Record<string, { title: string; fields: ContentFieldConfig[] }> = {
  home: {
    title: "Home Page",
    fields: [
      { key: "hero.heading", label: "Hero Heading", bilingual: true },
      { key: "hero.subtext", label: "Hero Subtext", type: "textarea", bilingual: true },
      { key: "hero.cta_primary", label: "Hero Primary CTA", bilingual: true },
      { key: "hero.cta_secondary", label: "Hero Secondary CTA", bilingual: true },
      { key: "categories_heading", label: "Categories Section Heading", bilingual: true },
      { key: "brands_heading", label: "Brands Section Heading", bilingual: true },
      { key: "brands_subtext", label: "Brands Section Subtext", type: "textarea", bilingual: true },
      { key: "about_heading", label: "About Teaser Heading", bilingual: true },
      { key: "about_text", label: "About Teaser Text", type: "textarea", bilingual: true },
      { key: "manufacturing_heading", label: "Manufacturing Heading", bilingual: true },
      { key: "manufacturing_text", label: "Manufacturing Text", type: "textarea", bilingual: true },
      { key: "distribution_heading", label: "Distribution Heading", bilingual: true },
      { key: "distribution_text", label: "Distribution Text", type: "textarea", bilingual: true },
      { key: "why_heading", label: "Why Gold Gravity Heading", bilingual: true },
      { key: "final_cta_heading", label: "Final CTA Heading", bilingual: true },
      { key: "final_cta_text", label: "Final CTA Text", type: "textarea", bilingual: true },
    ],
  },
  about: {
    title: "About Us Page",
    fields: [
      { key: "intro", label: "Intro Paragraph", type: "textarea", bilingual: true },
      { key: "vision", label: "Vision", type: "textarea", bilingual: true },
      { key: "mission", label: "Mission", type: "textarea", bilingual: true },
    ],
  },
  partnership: {
    title: "Distribution Partnership Page",
    fields: [
      { key: "heading", label: "Heading", bilingual: true },
      { key: "intro", label: "Intro Paragraph", type: "textarea", bilingual: true },
      { key: "disclaimer", label: "Disclaimer", type: "textarea", bilingual: true },
    ],
  },
  contact: {
    title: "Contact Us Page",
    fields: [
      { key: "heading", label: "Heading", bilingual: true },
      { key: "intro", label: "Intro Paragraph", type: "textarea", bilingual: true },
    ],
  },
};

export default async function AdminPageContentEditPage({ params }: { params: { locale: string; slug: string } }) {
  const config = FIELD_CONFIGS[params.slug];
  if (!config) notFound();

  const supabase = createClient();
  const { data: page } = await supabase.from("pages").select("*").eq("slug", params.slug).maybeSingle();

  return (
    <div>
      <AdminPageHeader title={config.title} description="Fields left blank keep their previous value." />
      <PageContentEditor
        slug={params.slug}
        initialContent={page?.content ?? {}}
        fields={config.fields}
        seo={{
          seo_title_en: page?.seo_title_en,
          seo_title_ar: page?.seo_title_ar,
          seo_description_en: page?.seo_description_en,
          seo_description_ar: page?.seo_description_ar,
        }}
      />
    </div>
  );
}
