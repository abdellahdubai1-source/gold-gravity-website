import { notFound } from "next/navigation";
import { getAllCategoriesAdmin, getAllBrandsAdmin, getProductByIdAdmin } from "@/lib/data/admin-queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductEditor } from "@/components/admin/ProductEditor";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const [categories, brands, product] = await Promise.all([
    getAllCategoriesAdmin(),
    getAllBrandsAdmin(),
    getProductByIdAdmin(params.id),
  ]);

  if (!product) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Product" description={product.name_en} />
      <ProductEditor
        locale={params.locale}
        categories={categories}
        brands={brands}
        initial={{ ...product, images: product.images.map((i: any) => ({ image_url: i.image_url, alt_text_en: i.alt_text_en, alt_text_ar: i.alt_text_ar })) }}
      />
    </div>
  );
}
