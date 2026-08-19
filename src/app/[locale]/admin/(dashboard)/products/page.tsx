import Link from "next/link";
import Image from "next/image";
import { getAllProductsAdmin } from "@/lib/data/admin-queries";
import { deleteProduct } from "@/lib/actions/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Pencil, PackageSearch } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({ params }: { params: { locale: string } }) {
  const products = await getAllProductsAdmin();
  const base = `/${params.locale}/admin`;

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description={`${products.length} product${products.length === 1 ? "" : "s"} in the catalogue`}
        action={
          <Link href={`${base}/products/new`} className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-white hover:bg-charcoal/90 transition-colors">
            + Add Product
          </Link>
        }
      />

      {products.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <PackageSearch className="h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">No products yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-start text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3.5 text-start">Product</th>
                <th className="px-5 py-3.5 text-start hidden sm:table-cell">Brand</th>
                <th className="px-5 py-3.5 text-start hidden md:table-cell">Size</th>
                <th className="px-5 py-3.5 text-start">Status</th>
                <th className="px-5 py-3.5 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                        {p.main_image_url && (
                          <Image src={p.main_image_url} alt="" fill sizes="44px" className="object-contain p-1" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">{p.name_en}</p>
                        <p className="truncate text-xs text-slate-400">{p.name_ar}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell text-slate-600">{p.brand?.name}</td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-slate-600">{p.size_label}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        p.status === "published" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {p.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`${base}/products/${p.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <DeleteButton
                        confirmMessage={`Delete "${p.name_en}"? This cannot be undone.`}
                        action={deleteProduct.bind(null, p.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
