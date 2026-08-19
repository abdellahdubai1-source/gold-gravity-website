import Link from "next/link";
import Image from "next/image";
import { getAllBrandsAdmin } from "@/lib/data/admin-queries";
import { deleteBrand } from "@/lib/actions/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage({ params }: { params: { locale: string } }) {
  const brands = await getAllBrandsAdmin();
  const base = `/${params.locale}/admin`;

  return (
    <div>
      <AdminPageHeader
        title="Brands"
        description="Add a fifth or sixth brand any time — no code changes needed."
        action={
          <Link href={`${base}/brands/new`} className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-white hover:bg-charcoal/90 transition-colors">
            + Add Brand
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b: any) => (
          <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div className="relative h-12 w-24">
                {b.logo_url && <Image src={b.logo_url} alt={b.name} fill sizes="96px" className="object-contain object-left" />}
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${b.is_published ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                {b.is_published ? "Published" : "Draft"}
              </span>
            </div>
            <h3 className="mt-4 font-semibold text-slate-800">{b.name}</h3>
            <p className="mt-1 text-xs text-slate-400">{b.brand_line_en}</p>
            <div className="mt-5 flex items-center justify-between">
              <Link href={`${base}/brands/${b.id}`} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Link>
              <DeleteButton
                confirmMessage={`Delete "${b.name}"? Its products must be reassigned or removed first.`}
                action={deleteBrand.bind(null, b.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
