import { getAllCategoriesAdmin } from "@/lib/data/admin-queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BrandEditor } from "@/components/admin/BrandEditor";

export const dynamic = "force-dynamic";

export default async function NewBrandPage({ params }: { params: { locale: string } }) {
  const categories = await getAllCategoriesAdmin();
  return (
    <div>
      <AdminPageHeader title="Add Brand" description="New brands automatically get their own page and routes." />
      <BrandEditor locale={params.locale} categories={categories} />
    </div>
  );
}
