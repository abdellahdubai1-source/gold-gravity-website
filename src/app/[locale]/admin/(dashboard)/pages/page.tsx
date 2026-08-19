import Link from "next/link";
import { FileText, Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

const EDITABLE_PAGES = [
  { slug: "home", title: "Home", description: "Hero, categories, brands, about teaser, manufacturing, distribution, why-us and final CTA sections." },
  { slug: "about", title: "About Us", description: "Company intro, vision and mission." },
  { slug: "partnership", title: "Distribution Partnership", description: "Heading, intro copy and disclaimer." },
  { slug: "contact", title: "Contact Us", description: "Heading and intro copy shown above the contact form." },
];

export default function AdminPagesListPage({ params }: { params: { locale: string } }) {
  const base = `/${params.locale}/admin`;
  return (
    <div>
      <AdminPageHeader title="Pages" description="Edit key website content without touching code." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {EDITABLE_PAGES.map((p) => (
          <div key={p.slug} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-champagne-dark/10 text-champagne-dark">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-800">{p.title}</h3>
                <p className="mt-1 text-xs text-slate-400">{p.description}</p>
              </div>
            </div>
            <Link href={`${base}/pages/${p.slug}`} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
