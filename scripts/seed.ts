/**
 * Gold Gravity Trading LLC — database seed script
 * ---------------------------------------------------------------
 * Loads the approved initial catalogue (from the developer brief)
 * into Supabase: categories, brands, brand<->category links,
 * products, product images, homepage/about/partnership page
 * content, and default site settings.
 *
 * Usage:
 *   1. Copy .env.example to .env.local and fill in real Supabase
 *      credentials (including SUPABASE_SERVICE_ROLE_KEY).
 *   2. Run the schema.sql and policies.sql files in the Supabase
 *      SQL editor first.
 *   3. npm run seed
 *
 * The script is idempotent — it upserts by slug/barcode, so it is
 * safe to re-run after editing this file.
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "\n[seed] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.\n" +
      "Copy .env.example to .env.local and fill in your Supabase project credentials first.\n"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------------------------------------------------------------------
// CATEGORIES
// ---------------------------------------------------------------------
const categories = [
  {
    slug: "chips-snacks",
    name_en: "Chips & Snacks",
    name_ar: "الشيبس والوجبات الخفيفة",
    description_en: "Crispy potato chips and snack products for retail and wholesale.",
    description_ar: "رقائق البطاطس المقرمشة ومنتجات الوجبات الخفيفة للبيع بالتجزئة والجملة.",
    display_order: 1,
    seo_title_en: "Chips & Snacks | Gold Gravity Products UAE",
    seo_title_ar: "الشيبس والوجبات الخفيفة | منتجات جولد جرافيتي",
    seo_description_en: "Browse Gold Gravity's chips & snacks category, featuring WAVES potato chips available for wholesale supply across the UAE.",
    image_url: "/images/products/waves/waves-tomato-90g.png",
  },
  {
    slug: "spreads-confectionery",
    name_en: "Spreads & Confectionery",
    name_ar: "الكريمات والحلويات",
    description_en: "Rich, creamy spreads for breakfast, desserts and pastries.",
    description_ar: "كريمات غنية ومميزة للفطور والحلويات والمعجنات.",
    display_order: 2,
    seo_title_en: "Spreads & Confectionery | Gold Gravity Products UAE",
    seo_title_ar: "الكريمات والحلويات | منتجات جولد جرافيتي",
    seo_description_en: "Explore PRIME pistachio, kunafa and hazelnut spreads distributed by Gold Gravity across the UAE.",
    image_url: "/images/products/prime/prime-pistachio-cream-200g.jpeg",
  },
  {
    slug: "seasonings-food-products",
    name_en: "Seasonings & Food Products",
    name_ar: "المنكهات والمواد الغذائية",
    description_en: "Practical seasoning and food products for everyday use.",
    description_ar: "منتجات تتبيل وغذائية عملية للاستخدام اليومي.",
    display_order: 3,
    seo_title_en: "Seasonings & Food Products | Gold Gravity Products UAE",
    seo_title_ar: "المنكهات والمواد الغذائية | منتجات جولد جرافيتي",
    seo_description_en: "Discover LIMORA lemon seasoning and other food products supplied by Gold Gravity in the UAE.",
    image_url: "/images/products/limora/limora-lemon-seasoning-1l.jpeg",
  },
  {
    slug: "plastic-household-products",
    name_en: "Plastic & Household Products",
    name_ar: "البلاستيك والمنتجات المنزلية",
    description_en: "Garbage bags, table covers and household essentials.",
    description_ar: "أكياس القمامة ومفارش السفرة ومستلزمات المنزل الأساسية.",
    display_order: 4,
    seo_title_en: "Plastic & Household Products | AL TAWFEER | Gold Gravity",
    seo_title_ar: "البلاستيك والمنتجات المنزلية | التوفير | جولد جرافيتي",
    seo_description_en: "Shop AL TAWFEER garbage bags, table covers and household products distributed by Gold Gravity across the UAE.",
    image_url: "/images/products/al-tawfeer/garbage-50-gallon-thick.jpg",
  },
  {
    slug: "paper-hygiene-products",
    name_en: "Paper & Hygiene Products",
    name_ar: "المنتجات الورقية",
    description_en: "Multi-use rolls, toilet paper and paper hygiene essentials.",
    description_ar: "المناشف متعددة الاستخدام وورق التواليت ومستلزمات النظافة الورقية.",
    display_order: 5,
    seo_title_en: "Paper & Hygiene Products | AL TAWFEER | Gold Gravity",
    seo_title_ar: "المنتجات الورقية | التوفير | جولد جرافيتي",
    seo_description_en: "Browse AL TAWFEER multi-use rolls and toilet paper products distributed by Gold Gravity in the UAE.",
    image_url: "/images/products/al-tawfeer/maxi-roll-350m.jpg",
  },
];

// ---------------------------------------------------------------------
// BRANDS  (categories referenced by slug, resolved after insert)
// ---------------------------------------------------------------------
const brands = [
  {
    slug: "waves",
    name: "WAVES",
    brand_line_en: "Crunch Into Flavor",
    brand_line_ar: "قرمشة ونكهات لكل الأذواق",
    description_en:
      "WAVES offers crispy potato chips in a variety of distinctive flavors created to suit different tastes, combining satisfying crunch, bold flavor and attractive packaging.",
    description_ar:
      "علامة WAVES متخصصة في رقائق البطاطس المقرمشة، تقدم مجموعة متنوعة من النكهات لتناسب أذواقًا مختلفة، مع التركيز على المذاق المميز، القرمشة، والتغليف الجذاب.",
    logo_url: "/images/logos/waves-logo-reference.png",
    hero_image_url: "/images/products/waves/waves-tomato-90g.png",
    country_of_origin: "Egypt",
    display_order: 1,
    seo_title_en: "WAVES Potato Chips UAE | Gold Gravity Trading",
    seo_title_ar: "شيبس ويفز | جولد جرافيتي للتجارة",
    seo_description_en: "Discover WAVES potato chips in multiple flavors and 42g / 90g sizes, available for commercial supply and distribution in the UAE.",
    categorySlugs: ["chips-snacks"],
  },
  {
    slug: "prime",
    name: "PRIME",
    brand_line_en: "Rich Taste in Every Spoon",
    brand_line_ar: "مذاق غني في كل ملعقة",
    description_en:
      "PRIME brings rich, creamy spreads to the table — pistachio cream, pistachio cream layered with kunafa and hazelnut, and a crunchy hazelnut spread with cocoa — made for desserts, pastries, breakfast and everyday enjoyment.",
    description_ar:
      "تقدّم PRIME كريمات غنية وقوامها ناعم — كريمة الفستق، وكريمة الفستق مع الكنافة والبندق، وكريمة البندق المقرمشة بالكاكاو — مثالية للحلويات والمعجنات والفطور والاستخدام اليومي.",
    logo_url: "/images/logos/prime-logo-reference.png",
    hero_image_url: "/images/products/prime/prime-pistachio-kunafa-hazelnut-200g.jpeg",
    country_of_origin: null,
    display_order: 2,
    seo_title_en: "PRIME Spreads UAE | Pistachio & Hazelnut Cream",
    seo_title_ar: "كريمات برايم | فستق وبندق",
    seo_description_en: "Discover PRIME pistachio, kunafa, hazelnut and cocoa spreads in 200g jars, available for commercial supply and distribution in the UAE.",
    categorySlugs: ["spreads-confectionery"],
  },
  {
    slug: "limora",
    name: "LIMORA",
    brand_line_en: "A Touch of Lemon Makes the Difference",
    brand_line_ar: "لمسة ليمون... تصنع الفرق",
    description_en:
      "LIMORA is a food and seasoning brand offering practical products with distinctive flavors for everyday use, with a focus on quality and convenience.",
    description_ar:
      "LIMORA علامة غذائية متخصصة في التتبيلات، تقدّم منتجات عملية بنكهات مميزة للاستخدام اليومي، مع التركيز على الجودة والراحة.",
    logo_url: null,
    hero_image_url: "/images/products/limora/limora-lemon-seasoning-1l.jpeg",
    country_of_origin: "UAE",
    display_order: 3,
    seo_title_en: "LIMORA Lemon Seasoning 1L UAE | Gold Gravity",
    seo_title_ar: "منكه ليمون ليمورا 1 لتر | جولد جرافيتي",
    seo_description_en: "LIMORA Lemon Seasoning 1L, made in the UAE and available for commercial supply and distribution through Gold Gravity.",
    categorySlugs: ["seasonings-food-products"],
  },
  {
    slug: "al-tawfeer",
    name: "AL TAWFEER",
    brand_line_en: "Practical Solutions for Everyday Needs",
    brand_line_ar: "حلول عملية للاستخدام اليومي",
    description_en:
      "AL TAWFEER offers a practical range of household and consumer products, including garbage bags, table covers, multi-use rolls and toilet paper, with a focus on quality, convenience and everyday value.",
    description_ar:
      "تقدّم التوفير مجموعة عملية من المنتجات المنزلية والاستهلاكية، تشمل أكياس القمامة ومفارش السفرة والمناشف متعددة الاستخدام وورق التواليت، مع التركيز على الجودة والراحة والقيمة اليومية.",
    logo_url: "/images/logos/al-tawfeer-logo-reference.png",
    hero_image_url: "/images/products/al-tawfeer/garbage-50-gallon-thick.jpg",
    country_of_origin: "Kuwait",
    display_order: 4,
    seo_title_en: "AL TAWFEER Plastic & Household Products | UAE Distributor",
    seo_title_ar: "منتجات التوفير البلاستيكية والمنزلية | موزع الإمارات",
    seo_description_en: "Discover AL TAWFEER garbage bags, table covers and paper products supplied through Gold Gravity in the UAE.",
    categorySlugs: ["plastic-household-products", "paper-hygiene-products"],
  },
];

// ---------------------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------------------
type SeedProduct = {
  slug: string;
  brandSlug: string;
  categorySlugs: string[];
  name_en: string;
  name_ar: string;
  short_description_en: string;
  short_description_ar: string;
  country_of_origin: string;
  size_label: string;
  carton_qty: string;
  barcode: string;
  main_image_url: string;
  gallery?: string[];
  display_order: number;
};

const wavesFlavors = [
  {
    key: "tomato",
    name_en: "Tomato",
    name_ar: "طماطم",
    desc_en: "Crispy potato chips with a distinctive, rich tomato flavor.",
    desc_ar: "رقائق بطاطس مقرمشة بنكهة الطماطم المميزة، بطعم غني وممتع.",
  },
  {
    key: "chili-lemon",
    name_en: "Chili & Lemon",
    name_ar: "فلفل حار وليمون",
    desc_en: "A distinctive combination of spicy chili and a refreshing touch of lemon.",
    desc_ar: "مزيج مميز يجمع نكهة الفلفل الحار مع لمسة الليمون المنعشة.",
  },
  {
    key: "seasoned-cheese",
    name_en: "Seasoned Cheese",
    name_ar: "جبنة متبلة",
    desc_en: "Crispy potato chips with a rich seasoned cheese flavor.",
    desc_ar: "رقائق بطاطس مقرمشة بنكهة الجبنة المتبلة الغنية.",
  },
  {
    key: "kebab",
    name_en: "Kebab",
    name_ar: "كباب",
    desc_en: "Crispy potato chips with a distinctive, savory kebab flavor.",
    desc_ar: "رقائق بطاطس مقرمشة بنكهة الكباب الغنية والمميزة.",
  },
  {
    key: "sweet-chili",
    name_en: "Sweet Chili",
    name_ar: "حلو وحار",
    desc_en: "A delicious balance of sweetness and heat with the signature WAVES crunch.",
    desc_ar: "توازن لذيذ بين الحلاوة والحرارة مع قرمشة WAVES المميزة.",
  },
  {
    key: "max-fire",
    name_en: "Max Fire",
    name_ar: "ماكس فاير",
    desc_en: "A bold and fiery flavor created for those who enjoy an intense spicy taste.",
    desc_ar: "نكهة حارة وقوية لمحبي المذاق الجريء.",
  },
];

const wavesVariants: { key: string; size: string; carton: string; barcode: string; gallery?: string }[] = [
  { key: "tomato", size: "90g", carton: "9 pcs", barcode: "6222035242260" },
  { key: "chili-lemon", size: "90g", carton: "9 pcs", barcode: "6222035242284", gallery: "waves-chili-lemon-90g-back.png" },
  { key: "seasoned-cheese", size: "90g", carton: "9 pcs", barcode: "6222035242277", gallery: "waves-seasoned-cheese-90g-back.png" },
  { key: "kebab", size: "90g", carton: "9 pcs", barcode: "6222035242253", gallery: "waves-kebab-90g-back.png" },
  { key: "sweet-chili", size: "90g", carton: "9 pcs", barcode: "6222035242246" },
  { key: "max-fire", size: "90g", carton: "9 pcs", barcode: "6222035242239", gallery: "waves-max-fire-90g-back.png" },
  { key: "sweet-chili", size: "42g", carton: "24 pcs", barcode: "6222035242369", gallery: "waves-sweet-chili-42g-back.png" },
  { key: "chili-lemon", size: "42g", carton: "24 pcs", barcode: "6222035242390" },
  { key: "seasoned-cheese", size: "42g", carton: "24 pcs", barcode: "6222035242383" },
  { key: "kebab", size: "42g", carton: "24 pcs", barcode: "6222035242376" },
  { key: "tomato", size: "42g", carton: "24 pcs", barcode: "6222035242406", gallery: "waves-tomato-42g-back.png" },
];

const wavesProducts: SeedProduct[] = wavesVariants.map((v, i) => {
  const f = wavesFlavors.find((x) => x.key === v.key)!;
  const sizeSlug = v.size.replace("g", "g");
  return {
    slug: `waves-${f.key}-${v.size}`,
    brandSlug: "waves",
    categorySlugs: ["chips-snacks"],
    name_en: `WAVES ${f.name_en} ${v.size}`,
    name_ar: `ويفز ${f.name_ar} ${v.size}`,
    short_description_en: f.desc_en,
    short_description_ar: f.desc_ar,
    country_of_origin: "Egypt",
    size_label: v.size,
    carton_qty: v.carton,
    barcode: v.barcode,
    main_image_url: `/images/products/waves/waves-${f.key}-${sizeSlug}.png`,
    gallery: v.gallery ? [`/images/products/waves/${v.gallery}`] : undefined,
    display_order: i + 1,
  };
});

const primeProducts: SeedProduct[] = [
  {
    slug: "prime-pistachio-cream-spread-200g",
    brandSlug: "prime",
    categorySlugs: ["spreads-confectionery"],
    name_en: "PRIME Pistachio Cream Spread",
    name_ar: "كريمة الفستق برايم",
    short_description_en:
      "Rich and creamy pistachio spread with a smooth texture and delicious nutty taste. Perfect for desserts, pastries, breakfast and everyday enjoyment.",
    short_description_ar:
      "كريمة فستق غنية وكريمية بقوام ناعم ومذاق مميز. مثالية للحلويات والمعجنات والفطور والاستخدام اليومي.",
    country_of_origin: "—",
    size_label: "200g",
    carton_qty: "24 pcs",
    barcode: "6292556003350",
    main_image_url: "/images/products/prime/prime-pistachio-cream-200g.jpeg",
    display_order: 1,
  },
  {
    slug: "prime-pistachio-cream-spread-kunafa-hazelnut-200g",
    brandSlug: "prime",
    categorySlugs: ["spreads-confectionery"],
    name_en: "PRIME Pistachio Cream Spread with Kunafa & Hazelnut",
    name_ar: "كريمة الفستق بالكنافة والبندق برايم",
    short_description_en:
      "A delicious layered combination of pistachio cream, kunafa and hazelnut, inspired by the rich taste of Dubai chocolate.",
    short_description_ar:
      "مزيج شهي من كريمة الفستق والكنافة والبندق، مستوحى من المذاق الغني لشوكولاتة دبي.",
    country_of_origin: "—",
    size_label: "200g",
    carton_qty: "24 pcs",
    barcode: "6298454345431",
    main_image_url: "/images/products/prime/prime-pistachio-kunafa-hazelnut-200g.jpeg",
    display_order: 2,
  },
  {
    slug: "prime-crunchy-hazelnut-spread-cocoa-200g",
    brandSlug: "prime",
    categorySlugs: ["spreads-confectionery"],
    name_en: "PRIME Crunchy Hazelnut Spread with Cocoa",
    name_ar: "كريمة البندق المقرمشة بالكاكاو برايم",
    short_description_en:
      "Creamy cocoa and hazelnut spread with a delicious crunchy texture, perfect for toast, desserts, pastries and snacks.",
    short_description_ar:
      "كريمة كاكاو وبندق بقوام كريمي ومقرمش، مثالية للتوست والحلويات والمعجنات والوجبات الخفيفة.",
    country_of_origin: "—",
    size_label: "200g",
    carton_qty: "24 pcs",
    barcode: "6290784543433",
    main_image_url: "/images/products/prime/prime-crunchy-hazelnut-cocoa-200g.jpg",
    display_order: 3,
  },
];

const limoraProducts: SeedProduct[] = [
  {
    slug: "limora-lemon-seasoning-1l",
    brandSlug: "limora",
    categorySlugs: ["seasonings-food-products"],
    name_en: "LIMORA Lemon Seasoning",
    name_ar: "منكّه ليمون ليمورا",
    short_description_en:
      "LIMORA Lemon Seasoning delivers a refreshing lemon flavor, perfect for adding a bright citrus touch to salads, seafood, marinades and a variety of dishes. Available in a convenient 1-liter PET bottle.",
    short_description_ar:
      "منكّه ليمون LIMORA يمنح نكهة منعشة ومميزة، مثالي لإضافة لمسة حمضية لذيذة إلى السلطات، والمأكولات البحرية، والتتبيلات، ومختلف الأطباق. يأتي في عبوة PET عملية بحجم 1 لتر.",
    country_of_origin: "UAE",
    size_label: "1 Liter (PET Bottle)",
    carton_qty: "12 pcs",
    barcode: "6297003250073",
    main_image_url: "/images/products/limora/limora-lemon-seasoning-1l.jpeg",
    display_order: 1,
  },
];

const altawfeerDesc = {
  en: "Practical, reliable AL TAWFEER quality for everyday household needs.",
  ar: "جودة عملية وموثوقة من التوفير لتلبية احتياجات المنزل اليومية.",
};

const altawfeerProducts: SeedProduct[] = [
  {
    slug: "al-tawfeer-maxi-roll-350m",
    brandSlug: "al-tawfeer",
    categorySlugs: ["paper-hygiene-products"],
    name_en: "Maxi Roll 350m Multi Use",
    name_ar: "ماكسي رول 350 متر متعدد الاستخدامات",
    short_description_en: altawfeerDesc.en,
    short_description_ar: altawfeerDesc.ar,
    country_of_origin: "Kuwait",
    size_label: "350m",
    carton_qty: "6 pcs",
    barcode: "2981215008549",
    main_image_url: "/images/products/al-tawfeer/maxi-roll-350m.jpg",
    display_order: 1,
  },
  {
    slug: "al-tawfeer-trash-bag-basket-5-gallon",
    brandSlug: "al-tawfeer",
    categorySlugs: ["plastic-household-products"],
    name_en: "Trash Bag for Basket 5 Gallon",
    name_ar: "كيس قمامة للسلة 5 جالون",
    short_description_en: altawfeerDesc.en,
    short_description_ar: altawfeerDesc.ar,
    country_of_origin: "Kuwait",
    size_label: "5 rolls / 150 bags / 50×46 cm",
    carton_qty: "24 pcs",
    barcode: "2730203011210",
    main_image_url: "/images/products/al-tawfeer/trash-bag-basket-5-gallon.jpg",
    display_order: 2,
  },
  {
    slug: "al-tawfeer-trash-bag-basket-8-gallon",
    brandSlug: "al-tawfeer",
    categorySlugs: ["plastic-household-products"],
    name_en: "Trash Bag for Basket 8 Gallon",
    name_ar: "كيس قمامة للسلة 8 جالون",
    short_description_en: altawfeerDesc.en,
    short_description_ar: altawfeerDesc.ar,
    country_of_origin: "Kuwait",
    size_label: "4 rolls / 120 bags / 58×50 cm",
    carton_qty: "24 pcs",
    barcode: "2730203011227",
    main_image_url: "/images/products/al-tawfeer/trash-bag-basket-8-gallon.jpg",
    display_order: 3,
  },
  {
    slug: "al-tawfeer-trash-bag-basket-10-gallon",
    brandSlug: "al-tawfeer",
    categorySlugs: ["plastic-household-products"],
    name_en: "Trash Bag for Basket 10 Gallon",
    name_ar: "كيس قمامة للسلة 10 جالون",
    short_description_en: altawfeerDesc.en,
    short_description_ar: altawfeerDesc.ar,
    country_of_origin: "Kuwait",
    size_label: "3 rolls / 90 bags / 65×52 cm",
    carton_qty: "24 pcs",
    barcode: "2730203011234",
    main_image_url: "/images/products/al-tawfeer/trash-bag-basket-10-gallon.jpg",
    display_order: 4,
  },
  {
    slug: "al-tawfeer-garbage-50-gallon-thick",
    brandSlug: "al-tawfeer",
    categorySlugs: ["plastic-household-products"],
    name_en: "Garbage 50 Gallon Thick",
    name_ar: "كيس قمامة سميك 50 جالون",
    short_description_en: altawfeerDesc.en,
    short_description_ar: altawfeerDesc.ar,
    country_of_origin: "Kuwait",
    size_label: "16 bags / 110×85 cm",
    carton_qty: "20 pcs",
    barcode: "74511085080",
    main_image_url: "/images/products/al-tawfeer/garbage-50-gallon-thick.jpg",
    gallery: ["/images/products/al-tawfeer/garbage-50-gallon-thick-alt.jpg"],
    display_order: 5,
  },
  {
    slug: "al-tawfeer-table-cover-3kg",
    brandSlug: "al-tawfeer",
    categorySlugs: ["plastic-household-products"],
    name_en: "Table Cover 3 KG",
    name_ar: "مفرش سفرة 3 كجم",
    short_description_en: altawfeerDesc.en,
    short_description_ar: altawfeerDesc.ar,
    country_of_origin: "Kuwait",
    size_label: "1 pc / 120×120 cm",
    carton_qty: "5 pcs",
    barcode: "1011003030041",
    main_image_url: "/images/products/al-tawfeer/table-cover-3kg.jpg",
    display_order: 6,
  },
  {
    slug: "al-tawfeer-table-cover-2kg",
    brandSlug: "al-tawfeer",
    categorySlugs: ["plastic-household-products"],
    name_en: "Table Cover 2 KG",
    name_ar: "مفرش سفرة 2 كجم",
    short_description_en: altawfeerDesc.en,
    short_description_ar: altawfeerDesc.ar,
    country_of_origin: "Kuwait",
    size_label: "1 pc / 110×100 cm",
    carton_qty: "10 pcs",
    barcode: "220030045014",
    main_image_url: "/images/products/al-tawfeer/table-cover-2kg.jpg",
    display_order: 7,
  },
  {
    slug: "al-tawfeer-table-cover-15-sheets",
    brandSlug: "al-tawfeer",
    categorySlugs: ["plastic-household-products"],
    name_en: "Table Cover 15 Sheets",
    name_ar: "مفرش سفرة 15 ورقة",
    short_description_en: altawfeerDesc.en,
    short_description_ar: altawfeerDesc.ar,
    country_of_origin: "Kuwait",
    size_label: "15 sheets / 110×100 cm",
    carton_qty: "15 pcs",
    barcode: "2020002040044",
    main_image_url: "/images/products/al-tawfeer/table-cover-15-sheets.jpg",
    display_order: 8,
  },
  {
    slug: "al-tawfeer-maxi-roll-extra-soft-twin-pack",
    brandSlug: "al-tawfeer",
    categorySlugs: ["paper-hygiene-products"],
    name_en: "Maxi Roll Extra Soft Twin Pack",
    name_ar: "ماكسي رول ناعم إضافي - عبوة توأم",
    short_description_en: altawfeerDesc.en,
    short_description_ar: altawfeerDesc.ar,
    country_of_origin: "Kuwait",
    size_label: "100% virgin pulp / 2 rolls",
    carton_qty: "3 pcs",
    barcode: "2981215008550",
    main_image_url: "/images/products/al-tawfeer/maxi-roll-extra-soft-twin-pack.jpg",
    display_order: 9,
  },
  {
    slug: "al-tawfeer-toilet-paper-extra-value",
    brandSlug: "al-tawfeer",
    categorySlugs: ["paper-hygiene-products"],
    name_en: "Toilet Paper Roll Extra Value",
    name_ar: "ورق تواليت اقتصادي",
    short_description_en: altawfeerDesc.en,
    short_description_ar: altawfeerDesc.ar,
    country_of_origin: "Kuwait",
    size_label: "100% virgin pulp / 200 sheets",
    carton_qty: "10 pcs",
    barcode: "2981215008551",
    main_image_url: "/images/products/al-tawfeer/toilet-paper-extra-value.jpeg",
    display_order: 10,
  },
  {
    slug: "al-tawfeer-table-cover-4pcs-25m",
    brandSlug: "al-tawfeer",
    categorySlugs: ["plastic-household-products"],
    name_en: "Table Cover 4 PCS / 25m",
    name_ar: "مفرش سفرة 4 قطع / 25 متر",
    short_description_en: altawfeerDesc.en,
    short_description_ar: altawfeerDesc.ar,
    country_of_origin: "Kuwait",
    size_label: "110×110 cm",
    carton_qty: "10 pcs",
    barcode: "3000901014158",
    main_image_url: "/images/products/al-tawfeer/table-cover-4pcs-25m.jpg",
    display_order: 11,
  },
  {
    slug: "al-tawfeer-table-cover-3pcs-600g",
    brandSlug: "al-tawfeer",
    categorySlugs: ["plastic-household-products"],
    name_en: "Table Cover 3 PCS / 600g",
    name_ar: "مفرش سفرة 3 قطع / 600 جرام",
    short_description_en: altawfeerDesc.en,
    short_description_ar: altawfeerDesc.ar,
    country_of_origin: "Kuwait",
    size_label: "110×110 cm",
    carton_qty: "10 pcs",
    barcode: "3000901014165",
    main_image_url: "/images/products/al-tawfeer/table-cover-3pcs-600g.jpg",
    display_order: 12,
  },
  {
    slug: "al-tawfeer-garbage-50-gallon-thick-twin-pack",
    brandSlug: "al-tawfeer",
    categorySlugs: ["plastic-household-products"],
    name_en: "Garbage 50 Gallon Thick Twin Pack",
    name_ar: "كيس قمامة سميك 50 جالون - عبوة توأم",
    short_description_en: altawfeerDesc.en,
    short_description_ar: altawfeerDesc.ar,
    country_of_origin: "Kuwait",
    size_label: "2 pcs / 20 bags / 110×85 cm",
    carton_qty: "15 pcs",
    barcode: "245365862331",
    // No dedicated client photo was supplied for this specific twin-pack
    // configuration — using the closest approved product photo as a
    // stand-in. Replace from Admin > Products once the client supplies
    // a dedicated twin-pack photo.
    main_image_url: "/images/products/al-tawfeer/garbage-50-gallon-thick.jpg",
    display_order: 13,
  },
];

const allProducts: SeedProduct[] = [
  ...wavesProducts,
  ...primeProducts,
  ...limoraProducts,
  ...altawfeerProducts,
];

// ---------------------------------------------------------------------
// PAGE CONTENT (structured, bilingual) — home / about / partnership
// ---------------------------------------------------------------------
const pages = [
  {
    slug: "home",
    title_en: "Home",
    title_ar: "الرئيسية",
    seo_title_en: "Gold Gravity Trading LLC | Food & Consumer Products Distributor UAE",
    seo_title_ar: "جولد جرافيتي للتجارة | موزع منتجات غذائية واستهلاكية في الإمارات",
    seo_description_en:
      "Gold Gravity Trading LLC supplies and distributes food, snacks, confectionery, seasonings, plastic and household products across the UAE, serving a growing network of 400+ clients.",
    seo_description_ar:
      "شركة جولد جرافيتي للتجارة توفر وتوزع المنتجات الغذائية والوجبات الخفيفة والحلويات والمنكهات والمنتجات البلاستيكية والمنزلية في جميع أنحاء الإمارات، وتخدم شبكة متنامية تضم أكثر من 400 عميل.",
    content: {
      hero: {
        heading_en: "Connecting Quality Products with the Markets They Deserve.",
        heading_ar: "نربط المنتجات المميزة بالأسواق التي تستحقها.",
        subtext_en:
          "A UAE-based trading and distribution company specializing in food and consumer products, supported by a growing distribution network of more than 400 clients.",
        subtext_ar:
          "شركة متخصصة في تجارة وتوزيع المنتجات الغذائية والاستهلاكية في دولة الإمارات، مدعومة بشبكة توزيع متنامية تضم أكثر من 400 عميل.",
        cta_primary_en: "Explore Our Products",
        cta_primary_ar: "استكشف منتجاتنا",
        cta_secondary_en: "Become a Partner",
        cta_secondary_ar: "كن شريكًا",
        highlights: [
          { en: "400+ UAE Clients", ar: "أكثر من 400 عميل في الإمارات" },
          { en: "Business roots since 1995", ar: "جذور أعمال منذ عام 1995" },
          { en: "4 current brands", ar: "4 علامات تجارية حالية" },
          { en: "Growing distribution network", ar: "شبكة توزيع متنامية" },
        ],
      },
      categories_heading_en: "Selected Products for Today's Market Needs",
      categories_heading_ar: "منتجات مختارة لتلبية احتياجات السوق",
      brands_heading_en: "Brands Built for Growth",
      brands_heading_ar: "علامات تجارية نبني معها قيمة حقيقية في السوق",
      brands_subtext_en:
        "Gold Gravity represents a growing portfolio of brands across food and consumer product categories, with a focus on quality, strong products, and effective market reach.",
      brands_subtext_ar:
        "تمثل جولد جرافيتي محفظة متنامية من العلامات التجارية عبر فئات المنتجات الغذائية والاستهلاكية، مع التركيز على الجودة والمنتجات القوية والوصول الفعّال إلى السوق.",
      about_heading_en: "Your Trading & Distribution Partner in the UAE",
      about_heading_ar: "شريكك في التجارة والتوزيع داخل الإمارات",
      about_text_en:
        "Gold Gravity Trading specializes in the trading and distribution of food and consumer products across the United Arab Emirates, serving a growing network of more than 400 clients. With business roots and experience extending to Kuwait since 1995, we continue to strengthen our UAE presence through a diverse product portfolio, growing brands, and partnerships built on quality, trust, and reliable supply.",
      about_text_ar:
        "شركة Gold Gravity Trading متخصصة في تجارة وتوزيع المنتجات الغذائية والاستهلاكية في دولة الإمارات العربية المتحدة، مع تركيز واضح على بناء علامات تجارية قوية وتوفير منتجات تلبي احتياجات السوق. نخدم اليوم شبكة متنامية تضم أكثر من 400 عميل في دولة الإمارات، ونعمل باستمرار على توسيع نطاق التوزيع وإضافة منتجات وعلامات تجارية جديدة إلى محفظتنا. تمتد جذور وخبرة أعمال Gold Gravity إلى الكويت منذ عام 1995، حيث يتواجد نشاطنا أيضًا في قطاع تصنيع المنتجات البلاستيكية.",
      manufacturing_heading_en: "Manufacturing Experience Behind Our Business",
      manufacturing_heading_ar: "خبرة في التصنيع تدعم قوة أعمالنا",
      manufacturing_text_en:
        "Gold Gravity's experience extends to plastic products manufacturing in Kuwait, covering a wide range of plastic and packaging solutions for commercial and consumer applications. This manufacturing background gives us a direct understanding of quality, market requirements and customer needs, supporting our UAE trading and distribution operations.",
      manufacturing_text_ar:
        "تمتد خبرة Gold Gravity إلى قطاع تصنيع المنتجات البلاستيكية في الكويت، حيث تشمل مجموعة واسعة من حلول البلاستيك والتعبئة المخصصة للاستخدامات التجارية والاستهلاكية. هذه الخبرة تمنحنا فهمًا مباشرًا لمتطلبات الجودة، احتياجات السوق، ومتطلبات العملاء، وتدعم أعمالنا في التجارة والتوزيع داخل دولة الإمارات.",
      manufacturing_keywords: [
        { en: "Quality", ar: "الجودة" },
        { en: "Flexibility", ar: "المرونة" },
        { en: "Experience", ar: "الخبرة" },
      ],
      distribution_heading_en: "From Warehouse to Market",
      distribution_heading_ar: "من المخزن إلى نقاط البيع",
      distribution_text_en:
        "Gold Gravity operates a growing distribution network serving more than 400 clients across the UAE, delivering products efficiently across multiple retail and sales channels. Through organized warehousing, reliable supply and direct market follow-up, we work to strengthen the presence of our products and brands.",
      distribution_text_ar:
        "تمتلك Gold Gravity شبكة توزيع متنامية تخدم أكثر من 400 عميل في دولة الإمارات، وتعمل على إيصال منتجاتها إلى مختلف قنوات البيع بكفاءة وسرعة. من خلال التخزين المنظم، التوريد المستمر، والمتابعة المباشرة للسوق، نعمل على بناء حضور قوي لمنتجاتنا وعلاماتنا التجارية.",
      partnership_heading_en: "Your Product Deserves Stronger Market Reach",
      partnership_heading_ar: "منتجك يستحق وصولاً أقوى إلى السوق",
      partnership_text_en:
        "If you are a manufacturer, supplier or brand owner with a product ready for the UAE market, Gold Gravity can explore opportunities to become your distribution and market-access partner.",
      partnership_text_ar:
        "إذا كنت مصنّعًا، موردًا أو صاحب علامة تجارية ولديك منتج جاهز للسوق الإماراتي، يمكن لـ Gold Gravity أن تكون شريكك في التوزيع والوصول إلى السوق. ندرس المنتج وفرصه في السوق ونبحث إمكانية التعاون وفق نموذج تجاري مناسب للطرفين.",
      partnership_cta_primary_en: "Submit Your Product",
      partnership_cta_primary_ar: "قدّم منتجك",
      partnership_cta_secondary_en: "Talk to Our Team",
      partnership_cta_secondary_ar: "تحدث مع فريقنا",
      why_heading_en: "Why Gold Gravity?",
      why_heading_ar: "لماذا جولد جرافيتي؟",
      why_pillars: [
        {
          title_en: "400+ UAE Clients",
          title_ar: "أكثر من 400 عميل في الإمارات",
          text_en: "Growing distribution network serving more than 400 clients across the UAE.",
          text_ar: "شبكة توزيع متنامية تخدم أكثر من 400 عميل في جميع أنحاء الإمارات.",
        },
        {
          title_en: "Quality",
          title_ar: "الجودة",
          text_en: "Products selected to deliver quality and real market value.",
          text_ar: "منتجات مختارة لتقديم الجودة والقيمة الحقيقية في السوق.",
        },
        {
          title_en: "Reliable Supply",
          title_ar: "توريد موثوق",
          text_en: "Efficient order handling and dependable product availability.",
          text_ar: "معالجة فعّالة للطلبات وتوافر موثوق للمنتجات.",
        },
        {
          title_en: "Diverse Portfolio",
          title_ar: "محفظة متنوعة",
          text_en: "Food, snacks, seasonings, plastic, household and paper products.",
          text_ar: "منتجات غذائية ووجبات خفيفة ومنكهات ومنتجات بلاستيكية ومنزلية وورقية.",
        },
        {
          title_en: "Experience",
          title_ar: "الخبرة",
          text_en: "Business experience extending from Kuwait since 1995, with focus on UAE growth.",
          text_ar: "خبرة أعمال تمتد من الكويت منذ عام 1995، مع تركيز على النمو في الإمارات.",
        },
      ],
      final_cta_heading_en: "Ready to Do Business Together?",
      final_cta_heading_ar: "جاهزون لبدء أعمال جديدة معك؟",
      final_cta_text_en:
        "Whether you are looking to source our products, request a quotation, or explore distribution opportunities for your brand in the UAE, the Gold Gravity Trading team is ready to connect with you.",
      final_cta_text_ar:
        "سواء كنت تبحث عن منتجات للتوريد، ترغب في الحصول على عرض سعر، أو تبحث عن شريك لتوزيع منتجاتك في دولة الإمارات، فريق Gold Gravity Trading جاهز للتواصل معك.",
    },
  },
  {
    slug: "about",
    title_en: "About Us",
    title_ar: "من نحن",
    seo_title_en: "About Gold Gravity Trading LLC | UAE Trading & Distribution",
    seo_title_ar: "عن جولد جرافيتي للتجارة | التجارة والتوزيع في الإمارات",
    seo_description_en:
      "Learn about Gold Gravity Trading LLC, serving 400+ UAE clients with business roots and experience extending to Kuwait since 1995.",
    seo_description_ar:
      "تعرف على شركة جولد جرافيتي للتجارة، التي تخدم أكثر من 400 عميل في الإمارات وتمتد جذور خبرتها إلى الكويت منذ عام 1995.",
    content: {
      intro_en:
        "Gold Gravity Trading LLC specializes in the trading and distribution of food and consumer products in the United Arab Emirates, with a clear focus on building strong brands and supplying products that meet market needs. We currently serve a growing network of more than 400 clients in the UAE and continuously expand our distribution reach and brand portfolio. Gold Gravity's business roots and experience extend to Kuwait since 1995, including experience in plastic products manufacturing. In the UAE, our focus is trading, distribution, brand development and market access, building long-term relationships with customers, suppliers and manufacturers.",
      intro_ar:
        "شركة Gold Gravity Trading LLC متخصصة في تجارة وتوزيع المنتجات الغذائية والاستهلاكية في دولة الإمارات العربية المتحدة، مع تركيز واضح على بناء علامات تجارية قوية وتوفير منتجات تلبي احتياجات السوق. نخدم اليوم شبكة متنامية تضم أكثر من 400 عميل في دولة الإمارات، ونعمل باستمرار على توسيع نطاق التوزيع وإضافة منتجات وعلامات تجارية جديدة إلى محفظتنا. تمتد جذور وخبرة أعمال Gold Gravity إلى الكويت منذ عام 1995، بما في ذلك خبرة في قطاع تصنيع المنتجات البلاستيكية. في الإمارات، نركز على التجارة، التوزيع، تطوير العلامات التجارية والوصول إلى السوق، ونسعى إلى بناء علاقات طويلة الأمد مع العملاء والموردين والمصنعين.",
      vision_en: "To build Gold Gravity into a globally recognized trading and distribution name through strong products, sustainable partnerships and continuous market expansion.",
      vision_ar: "بناء Gold Gravity كاسم عالمي في التجارة والتوزيع، من خلال منتجات قوية، شراكات مستدامة، وتوسيع مستمر في الأسواق.",
      mission_en: "To provide quality products with competitive value, bring them to market efficiently and reliably, and build partnerships that create sustainable growth for all parties.",
      mission_ar: "توفير منتجات ذات جودة وقيمة تنافسية، والوصول بها إلى السوق بكفاءة وسرعة، مع بناء شراكات تحقق نموًا مستدامًا لجميع الأطراف.",
      values: [
        { en: "Quality", ar: "الجودة" },
        { en: "Trust", ar: "الثقة" },
        { en: "Speed", ar: "السرعة" },
        { en: "Commitment", ar: "الالتزام" },
        { en: "Growth", ar: "النمو" },
      ],
    },
  },
  {
    slug: "partnership",
    title_en: "Distribution Partnership",
    title_ar: "شراكة التوزيع",
    seo_title_en: "Distribution Partner in UAE | Gold Gravity Trading",
    seo_title_ar: "شريك التوزيع في الإمارات | جولد جرافيتي للتجارة",
    seo_description_en:
      "Manufacturer, supplier or brand owner? Explore distribution and UAE market-entry partnership opportunities with Gold Gravity.",
    seo_description_ar:
      "هل أنت مصنّع أو مورد أو صاحب علامة تجارية؟ استكشف فرص الشراكة في التوزيع ودخول السوق الإماراتي مع جولد جرافيتي.",
    content: {
      heading_en: "A Strong Product Deserves a Strong Distribution Partner",
      heading_ar: "منتج قوي يستحق شريك توزيع قوي",
      intro_en:
        "If you are a manufacturer, supplier, or brand owner looking to expand your products into the UAE, Gold Gravity Trading welcomes opportunities to explore distribution and market-entry partnerships. We evaluate the product, category, competitiveness and market potential before exploring a suitable commercial partnership model. Supported by a growing network of more than 400 clients across the UAE and our trading and distribution experience, we aim to turn promising products into sustainable market opportunities.",
      intro_ar:
        "إذا كنت مصنّعًا أو موردًا أو صاحب علامة تجارية وتتطلع لتوسيع منتجاتك في السوق الإماراتي، ترحب Gold Gravity Trading باستكشاف فرص الشراكة في التوزيع ودخول السوق. نقوم بتقييم المنتج والفئة والقدرة التنافسية وإمكانات السوق قبل استكشاف نموذج شراكة تجارية مناسب. وبدعم من شبكتنا المتنامية التي تضم أكثر من 400 عميل في الإمارات وخبرتنا في التجارة والتوزيع، نسعى إلى تحويل المنتجات الواعدة إلى فرص مستدامة في السوق.",
      process: [
        { en: "Submit your product / catalogue / pricing", ar: "قدّم منتجك / الكتالوج / التسعير" },
        { en: "Market and category review", ar: "مراجعة السوق والفئة" },
        { en: "Commercial model and agreement", ar: "النموذج التجاري والاتفاقية" },
        { en: "Market entry / distribution plan", ar: "خطة دخول السوق / التوزيع" },
      ],
      disclaimer_en:
        "Submission does not mean automatic acceptance for distribution. All opportunities are subject to review and commercial agreement.",
      disclaimer_ar:
        "تقديم الطلب لا يعني قبولًا تلقائيًا للتوزيع. تخضع جميع الفرص للمراجعة والاتفاق التجاري.",
    },
  },
  {
    slug: "request-a-quote",
    title_en: "Request a Quote",
    title_ar: "طلب عرض سعر",
    seo_title_en: "Request a Wholesale Quote | Gold Gravity UAE",
    seo_title_ar: "طلب عرض سعر بالجملة | جولد جرافيتي الإمارات",
    seo_description_en: "Request a wholesale quotation for WAVES, PRIME, LIMORA and AL TAWFEER products in the UAE.",
    seo_description_ar: "اطلب عرض سعر بالجملة لمنتجات ويفز وبرايم وليمورا والتوفير في الإمارات.",
    content: {
      heading_en: "Request a Quote for Our Products",
      heading_ar: "اطلب عرض سعر لمنتجاتنا",
      intro_en:
        "Interested in adding Gold Gravity products to your store or retail network? Select the products and required quantities, submit your request, and our sales team will review your inquiry and contact you with the appropriate commercial offer.",
      intro_ar:
        "هل ترغب في إضافة منتجات جولد جرافيتي إلى متجرك أو شبكة البيع بالتجزئة الخاصة بك؟ حدد المنتجات والكميات المطلوبة، وأرسل طلبك، وسيقوم فريق المبيعات لدينا بمراجعة استفسارك والتواصل معك بالعرض التجاري المناسب.",
    },
  },
  {
    slug: "contact",
    title_en: "Contact Us",
    title_ar: "اتصل بنا",
    seo_title_en: "Contact Gold Gravity Trading LLC | UAE",
    seo_title_ar: "تواصل مع جولد جرافيتي للتجارة | الإمارات",
    seo_description_en: "Contact Gold Gravity for product enquiries, wholesale supply, quotations and distribution partnerships in the UAE.",
    seo_description_ar: "تواصل مع جولد جرافيتي للاستفسار عن المنتجات والتوريد بالجملة وعروض الأسعار وشراكات التوزيع في الإمارات.",
    content: {
      heading_en: "Ready to Do Business Together?",
      heading_ar: "جاهزون لبدء أعمال جديدة معك؟",
      intro_en:
        "Whether you are looking to source our products, request a quotation, or explore distribution opportunities for your brand in the UAE, the Gold Gravity Trading team is ready to connect with you.",
      intro_ar:
        "سواء كنت تبحث عن منتجات للتوريد، ترغب في الحصول على عرض سعر، أو تبحث عن شريك لتوزيع منتجاتك في دولة الإمارات، فريق Gold Gravity Trading جاهز للتواصل معك.",
    },
  },
];

// ---------------------------------------------------------------------
// SEED LOGIC
// ---------------------------------------------------------------------
async function main() {
  console.log("\n[seed] Gold Gravity Trading — seeding Supabase...\n");

  // 1. Categories -------------------------------------------------------
  console.log("[seed] Upserting categories...");
  const { data: catRows, error: catErr } = await supabase
    .from("categories")
    .upsert(categories, { onConflict: "slug" })
    .select();
  if (catErr) throw catErr;
  const categoryBySlug = new Map(catRows!.map((c) => [c.slug, c]));
  console.log(`  -> ${catRows!.length} categories`);

  // 2. Brands -------------------------------------------------------------
  console.log("[seed] Upserting brands...");
  for (const b of brands) {
    const { categorySlugs, ...brandRow } = b;
    const { data: brandData, error: brandErr } = await supabase
      .from("brands")
      .upsert(brandRow, { onConflict: "slug" })
      .select()
      .single();
    if (brandErr) throw brandErr;

    // brand_categories links
    await supabase.from("brand_categories").delete().eq("brand_id", brandData.id);
    const links = categorySlugs
      .map((s) => categoryBySlug.get(s))
      .filter(Boolean)
      .map((c) => ({ brand_id: brandData.id, category_id: c!.id }));
    if (links.length) {
      const { error: linkErr } = await supabase.from("brand_categories").insert(links);
      if (linkErr) throw linkErr;
    }
  }
  console.log(`  -> ${brands.length} brands`);

  const { data: brandRows } = await supabase.from("brands").select();
  const brandBySlug = new Map(brandRows!.map((b) => [b.slug, b]));

  // 3. Products -----------------------------------------------------------
  console.log("[seed] Upserting products...");
  for (const p of allProducts) {
    const brand = brandBySlug.get(p.brandSlug);
    if (!brand) {
      console.warn(`  !! Skipping product ${p.slug} — brand ${p.brandSlug} not found`);
      continue;
    }
    const { categorySlugs, gallery, brandSlug, ...productRow } = p;
    const { data: productData, error: prodErr } = await supabase
      .from("products")
      .upsert(
        { ...productRow, brand_id: brand.id, status: "published" },
        { onConflict: "slug" }
      )
      .select()
      .single();
    if (prodErr) throw prodErr;

    // product_categories links
    await supabase.from("product_categories").delete().eq("product_id", productData.id);
    const links = categorySlugs
      .map((s) => categoryBySlug.get(s))
      .filter(Boolean)
      .map((c) => ({ product_id: productData.id, category_id: c!.id }));
    if (links.length) {
      const { error: linkErr } = await supabase.from("product_categories").insert(links);
      if (linkErr) throw linkErr;
    }

    // gallery images
    if (gallery?.length) {
      await supabase.from("product_images").delete().eq("product_id", productData.id);
      const imgs = gallery.map((url, idx) => ({
        product_id: productData.id,
        image_url: url,
        alt_text_en: `${p.name_en} — additional view`,
        alt_text_ar: `${p.name_ar} — صورة إضافية`,
        sort_order: idx,
      }));
      const { error: imgErr } = await supabase.from("product_images").insert(imgs);
      if (imgErr) throw imgErr;
    }
  }
  console.log(`  -> ${allProducts.length} products`);

  // 4. Pages ----------------------------------------------------------------
  console.log("[seed] Upserting page content...");
  const { error: pageErr } = await supabase
    .from("pages")
    .upsert(pages, { onConflict: "slug" });
  if (pageErr) throw pageErr;
  console.log(`  -> ${pages.length} pages`);

  // 5. Site settings (defaults only; safe to skip if already configured) ---
  console.log("[seed] Ensuring default site settings row exists...");
  const { error: settingsErr } = await supabase
    .from("site_settings")
    .upsert(
      {
        id: 1,
        whatsapp_number: "971505023438",
        call_number: "+971505044805",
        email: "info@goldgravityuae.com",
        working_hours_en: "Monday–Saturday, 8:00 AM–6:00 PM. Sunday: Closed",
        working_hours_ar: "الإثنين–السبت، 8:00 صباحًا–6:00 مساءً. الأحد: مغلق",
        default_seo_title_en: "Gold Gravity Trading LLC | Food & Consumer Products Distributor UAE",
        default_seo_title_ar: "جولد جرافيتي للتجارة | موزع منتجات غذائية واستهلاكية في الإمارات",
        default_seo_description_en:
          "Gold Gravity Trading LLC supplies and distributes food, snacks, confectionery, seasonings, plastic and household products across the UAE, serving a growing network of 400+ clients.",
        default_seo_description_ar:
          "شركة جولد جرافيتي للتجارة توفر وتوزع المنتجات الغذائية والوجبات الخفيفة والحلويات والمنكهات والمنتجات البلاستيكية والمنزلية في جميع أنحاء الإمارات.",
        logo_url: "/images/logos/gold-gravity-logo.jpeg",
      },
      { onConflict: "id" }
    );
  if (settingsErr) throw settingsErr;

  console.log("\n[seed] Done. The catalogue is ready.\n");
}

main().catch((err) => {
  console.error("\n[seed] Failed:", err);
  process.exit(1);
});
