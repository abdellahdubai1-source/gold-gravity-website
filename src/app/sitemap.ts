import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getCategories, getBrands, getProducts } from "@/lib/data/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://goldgravityuae.com";

const staticPaths = [
  "",
  "/about",
  "/products",
  "/brands",
  "/partnership",
  "/request-a-quote",
  "/contact",
  "/privacy-policy",
  "/terms-and-conditions",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, brands, products] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts({}),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }
    for (const category of categories) {
      entries.push({
        url: `${siteUrl}/${locale}/products/category/${category.slug}`,
        lastModified: category.updated_at,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
    for (const brand of brands) {
      entries.push({
        url: `${siteUrl}/${locale}/brands/${brand.slug}`,
        lastModified: brand.updated_at,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
    for (const product of products) {
      entries.push({
        url: `${siteUrl}/${locale}/products/${product.slug}`,
        lastModified: product.updated_at,
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
