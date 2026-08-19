import Link from "next/link";
import { Package, FolderTree, Tag, MessageSquareText, Handshake, Mail, ArrowUpRight } from "lucide-react";
import { getDashboardCounts } from "@/lib/data/admin-queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage({ params }: { params: { locale: string } }) {
  const counts = await getDashboardCounts();
  const base = `/${params.locale}/admin`;

  const stats = [
    { label: "Published Products", value: counts.products, href: `${base}/products`, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "Categories", value: counts.categories, href: `${base}/categories`, icon: FolderTree, color: "bg-emerald-50 text-emerald-600" },
    { label: "Brands", value: counts.brands, href: `${base}/brands`, icon: Tag, color: "bg-amber-50 text-amber-600" },
  ];

  const leads = [
    { label: "New Quote Requests", value: counts.newQuotes, href: `${base}/quotes`, icon: MessageSquareText },
    { label: "New Partnership Requests", value: counts.newPartnerships, href: `${base}/partnerships`, icon: Handshake },
    { label: "New Contact Messages", value: counts.newContacts, href: `${base}/contacts`, icon: Mail },
  ];

  return (
    <div>
      <AdminPageHeader title="Overview" description="A quick snapshot of your catalogue and incoming leads." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="mt-1.5 text-3xl font-semibold text-slate-800">{s.value}</p>
            </div>
            <span className={`flex h-11 w-11 items-center justify-center rounded-full ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </span>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Needs Attention
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {leads.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <p className="text-sm text-slate-500">{l.label}</p>
              <p className="mt-1.5 text-3xl font-semibold text-slate-800">{l.value}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-champagne-dark/10 text-champagne-dark">
                <l.icon className="h-5 w-5" />
              </span>
              {l.value > 0 && (
                <span className="flex items-center gap-1 text-xs font-medium text-champagne-dark">
                  Review <ArrowUpRight className="h-3 w-3" />
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-700">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`${base}/products/new`} className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-white hover:bg-charcoal/90 transition-colors">
            + Add Product
          </Link>
          <Link href={`${base}/brands/new`} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            + Add Brand
          </Link>
          <Link href={`${base}/categories/new`} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            + Add Category
          </Link>
          <Link href={`${base}/settings`} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            Edit Site Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
