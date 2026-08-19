import { notFound } from "next/navigation";
import { getAllCategoriesAdmin, getBrandByIdAdmin } from "@/lib/data/admin-queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BrandEditor } from "@/components/admin/BrandEditor";

export const dynamic = "force-dynamic";

export default async function EditBrandPage({ params }: { params: { locale: string; id: string } }) {
  const [categories, brand] = await Promise.all([getAllCategoriesAdmin(), getBrandByIdAdmin(params.id)]);
  if (!brand) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Brand" description={brand.name} />
      <BrandEditor locale={params.locale} categories={categories} initial={brand} />
    </div>
  );
}
