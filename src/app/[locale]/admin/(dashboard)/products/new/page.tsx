import { getAllCategoriesAdmin, getAllBrandsAdmin } from "@/lib/data/admin-queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductEditor } from "@/components/admin/ProductEditor";

export const dynamic = "force-dynamic";

export default async function NewProductPage({ params }: { params: { locale: string } }) {
  const [categories, brands] = await Promise.all([getAllCategoriesAdmin(), getAllBrandsAdmin()]);

  return (
    <div>
      <AdminPageHeader title="Add Product" description="Create a new product in the catalogue." />
      <ProductEditor locale={params.locale} categories={categories} brands={brands} />
    </div>
  );
}
