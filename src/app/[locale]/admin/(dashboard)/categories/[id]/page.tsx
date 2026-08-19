import { notFound } from "next/navigation";
import { getCategoryByIdAdmin } from "@/lib/data/admin-queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CategoryEditor } from "@/components/admin/CategoryEditor";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({ params }: { params: { locale: string; id: string } }) {
  const category = await getCategoryByIdAdmin(params.id);
  if (!category) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Category" description={category.name_en} />
      <CategoryEditor locale={params.locale} initial={category} />
    </div>
  );
}
