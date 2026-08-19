import Link from "next/link";
import Image from "next/image";
import { getAllCategoriesAdmin } from "@/lib/data/admin-queries";
import { deleteCategory } from "@/lib/actions/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({ params }: { params: { locale: string } }) {
  const categories = await getAllCategoriesAdmin();
  const base = `/${params.locale}/admin`;

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Product categories shown on the homepage and in the catalogue filters."
        action={
          <Link href={`${base}/categories/new`} className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-white hover:bg-charcoal/90 transition-colors">
            + Add Category
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-start text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3.5 text-start">Category</th>
              <th className="px-5 py-3.5 text-start hidden sm:table-cell">Order</th>
              <th className="px-5 py-3.5 text-start">Status</th>
              <th className="px-5 py-3.5 text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((c: any) => (
              <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                      {c.image_url && <Image src={c.image_url} alt="" fill sizes="44px" className="object-cover" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{c.name_en}</p>
                      <p className="text-xs text-slate-400">{c.name_ar}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 hidden sm:table-cell text-slate-600">{c.display_order}</td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${c.is_published ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                    {c.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`${base}/categories/${c.id}`} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                    <DeleteButton
                      confirmMessage={`Delete "${c.name_en}"? Products in this category will need to be reassigned.`}
                      action={deleteCategory.bind(null, c.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
