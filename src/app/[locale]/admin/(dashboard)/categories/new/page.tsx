import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CategoryEditor } from "@/components/admin/CategoryEditor";

export default function NewCategoryPage({ params }: { params: { locale: string } }) {
  return (
    <div>
      <AdminPageHeader title="Add Category" description="New categories automatically appear across the site." />
      <CategoryEditor locale={params.locale} />
    </div>
  );
}
