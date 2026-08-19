-- =====================================================================
-- GOLD GRAVITY TRADING LLC — SEED DATA (idempotent SQL)
-- =====================================================================
-- Auto-generated from scripts/seed.ts's data arrays. The values below
-- (slugs, bilingual copy, barcodes, carton quantities, origins, image
-- paths, display orders, SEO fields) are copied verbatim from that
-- file — do not hand-edit the data here; edit scripts/seed.ts and
-- regenerate instead, so the two never drift apart.
--
-- Safe to re-run any number of times:
--   * categories / brands / products / pages upsert by their unique
--     `slug` (ON CONFLICT ... DO UPDATE), and only SET the columns
--     scripts/seed.ts itself populates — admin-edited columns the
--     seed script never touches (is_published, address/social fields,
--     ga_measurement_id, per-row SEO fields the seed leaves unset,
--     etc.) are left untouched on re-run, exactly like the Supabase
--     JS `.upsert()` calls in scripts/seed.ts.
--   * site_settings upserts the single `id = 1` row the same way.
--   * brand_categories / product_categories / product_images are
--     refreshed by deleting only the rows belonging to the specific
--     parent record being reseeded (matched by slug), then
--     re-inserting — matching scripts/seed.ts's delete-then-insert
--     pattern. No unrelated rows are ever touched or deleted.
--
-- Run this AFTER supabase/schema.sql and supabase/policies.sql have
-- both been applied. Does not modify schema, RLS policies, or any
-- table not listed above.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. CATEGORIES
-- ---------------------------------------------------------------------
insert into categories (slug, name_en, name_ar, description_en, description_ar, image_url, display_order, seo_title_en, seo_title_ar, seo_description_en, seo_description_ar)
values
  ('chips-snacks', 'Chips & Snacks', 'الشيبس والوجبات الخفيفة', 'Crispy potato chips and snack products for retail and wholesale.', 'رقائق البطاطس المقرمشة ومنتجات الوجبات الخفيفة للبيع بالتجزئة والجملة.', '/images/products/waves/waves-tomato-90g.png', 1, 'Chips & Snacks | Gold Gravity Products UAE', 'الشيبس والوجبات الخفيفة | منتجات جولد جرافيتي', 'Browse Gold Gravity''s chips & snacks category, featuring WAVES potato chips available for wholesale supply across the UAE.', NULL),
  ('spreads-confectionery', 'Spreads & Confectionery', 'الكريمات والحلويات', 'Rich, creamy spreads for breakfast, desserts and pastries.', 'كريمات غنية ومميزة للفطور والحلويات والمعجنات.', '/images/products/prime/prime-pistachio-cream-200g.jpeg', 2, 'Spreads & Confectionery | Gold Gravity Products UAE', 'الكريمات والحلويات | منتجات جولد جرافيتي', 'Explore PRIME pistachio, kunafa and hazelnut spreads distributed by Gold Gravity across the UAE.', NULL),
  ('seasonings-food-products', 'Seasonings & Food Products', 'المنكهات والمواد الغذائية', 'Practical seasoning and food products for everyday use.', 'منتجات تتبيل وغذائية عملية للاستخدام اليومي.', '/images/products/limora/limora-lemon-seasoning-1l.jpeg', 3, 'Seasonings & Food Products | Gold Gravity Products UAE', 'المنكهات والمواد الغذائية | منتجات جولد جرافيتي', 'Discover LIMORA lemon seasoning and other food products supplied by Gold Gravity in the UAE.', NULL),
  ('plastic-household-products', 'Plastic & Household Products', 'البلاستيك والمنتجات المنزلية', 'Garbage bags, table covers and household essentials.', 'أكياس القمامة ومفارش السفرة ومستلزمات المنزل الأساسية.', '/images/products/al-tawfeer/garbage-50-gallon-thick.jpg', 4, 'Plastic & Household Products | AL TAWFEER | Gold Gravity', 'البلاستيك والمنتجات المنزلية | التوفير | جولد جرافيتي', 'Shop AL TAWFEER garbage bags, table covers and household products distributed by Gold Gravity across the UAE.', NULL),
  ('paper-hygiene-products', 'Paper & Hygiene Products', 'المنتجات الورقية', 'Multi-use rolls, toilet paper and paper hygiene essentials.', 'المناشف متعددة الاستخدام وورق التواليت ومستلزمات النظافة الورقية.', '/images/products/al-tawfeer/maxi-roll-350m.jpg', 5, 'Paper & Hygiene Products | AL TAWFEER | Gold Gravity', 'المنتجات الورقية | التوفير | جولد جرافيتي', 'Browse AL TAWFEER multi-use rolls and toilet paper products distributed by Gold Gravity in the UAE.', NULL)
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  description_en = excluded.description_en,
  description_ar = excluded.description_ar,
  image_url = excluded.image_url,
  display_order = excluded.display_order,
  seo_title_en = excluded.seo_title_en,
  seo_title_ar = excluded.seo_title_ar,
  seo_description_en = excluded.seo_description_en,
  seo_description_ar = excluded.seo_description_ar;

-- ---------------------------------------------------------------------
-- 2. BRANDS
-- ---------------------------------------------------------------------
insert into brands (slug, name, brand_line_en, brand_line_ar, description_en, description_ar, logo_url, hero_image_url, country_of_origin, display_order, seo_title_en, seo_title_ar, seo_description_en)
values
  ('waves', 'WAVES', 'Crunch Into Flavor', 'قرمشة ونكهات لكل الأذواق', 'WAVES offers crispy potato chips in a variety of distinctive flavors created to suit different tastes, combining satisfying crunch, bold flavor and attractive packaging.', 'علامة WAVES متخصصة في رقائق البطاطس المقرمشة، تقدم مجموعة متنوعة من النكهات لتناسب أذواقًا مختلفة، مع التركيز على المذاق المميز، القرمشة، والتغليف الجذاب.', '/images/logos/waves-logo-reference.png', '/images/products/waves/waves-tomato-90g.png', 'Egypt', 1, 'WAVES Potato Chips UAE | Gold Gravity Trading', 'شيبس ويفز | جولد جرافيتي للتجارة', 'Discover WAVES potato chips in multiple flavors and 42g / 90g sizes, available for commercial supply and distribution in the UAE.'),
  ('prime', 'PRIME', 'Rich Taste in Every Spoon', 'مذاق غني في كل ملعقة', 'PRIME brings rich, creamy spreads to the table — pistachio cream, pistachio cream layered with kunafa and hazelnut, and a crunchy hazelnut spread with cocoa — made for desserts, pastries, breakfast and everyday enjoyment.', 'تقدّم PRIME كريمات غنية وقوامها ناعم — كريمة الفستق، وكريمة الفستق مع الكنافة والبندق، وكريمة البندق المقرمشة بالكاكاو — مثالية للحلويات والمعجنات والفطور والاستخدام اليومي.', '/images/logos/prime-logo-reference.png', '/images/products/prime/prime-pistachio-kunafa-hazelnut-200g.jpeg', '—', 2, 'PRIME Spreads UAE | Pistachio & Hazelnut Cream', 'كريمات برايم | فستق وبندق', 'Discover PRIME pistachio, kunafa, hazelnut and cocoa spreads in 200g jars, available for commercial supply and distribution in the UAE.'),
  ('limora', 'LIMORA', 'A Touch of Lemon Makes the Difference', 'لمسة ليمون... تصنع الفرق', 'LIMORA is a food and seasoning brand offering practical products with distinctive flavors for everyday use, with a focus on quality and convenience.', 'LIMORA علامة غذائية متخصصة في التتبيلات، تقدّم منتجات عملية بنكهات مميزة للاستخدام اليومي، مع التركيز على الجودة والراحة.', NULL, '/images/products/limora/limora-lemon-seasoning-1l.jpeg', 'UAE', 3, 'LIMORA Lemon Seasoning 1L UAE | Gold Gravity', 'منكه ليمون ليمورا 1 لتر | جولد جرافيتي', 'LIMORA Lemon Seasoning 1L, made in the UAE and available for commercial supply and distribution through Gold Gravity.'),
  ('al-tawfeer', 'AL TAWFEER', 'Practical Solutions for Everyday Needs', 'حلول عملية للاستخدام اليومي', 'AL TAWFEER offers a practical range of household and consumer products, including garbage bags, table covers, multi-use rolls and toilet paper, with a focus on quality, convenience and everyday value.', 'تقدّم التوفير مجموعة عملية من المنتجات المنزلية والاستهلاكية، تشمل أكياس القمامة ومفارش السفرة والمناشف متعددة الاستخدام وورق التواليت، مع التركيز على الجودة والراحة والقيمة اليومية.', '/images/logos/al-tawfeer-logo-reference.png', '/images/products/al-tawfeer/garbage-50-gallon-thick.jpg', 'Kuwait', 4, 'AL TAWFEER Plastic & Household Products | UAE Distributor', 'منتجات التوفير البلاستيكية والمنزلية | موزع الإمارات', 'Discover AL TAWFEER garbage bags, table covers and paper products supplied through Gold Gravity in the UAE.')
on conflict (slug) do update set
  name = excluded.name,
  brand_line_en = excluded.brand_line_en,
  brand_line_ar = excluded.brand_line_ar,
  description_en = excluded.description_en,
  description_ar = excluded.description_ar,
  logo_url = excluded.logo_url,
  hero_image_url = excluded.hero_image_url,
  country_of_origin = excluded.country_of_origin,
  display_order = excluded.display_order,
  seo_title_en = excluded.seo_title_en,
  seo_title_ar = excluded.seo_title_ar,
  seo_description_en = excluded.seo_description_en;

-- ---------------------------------------------------------------------
-- 3. BRAND_CATEGORIES (delete + reinsert, scoped to the seeded brands)
-- ---------------------------------------------------------------------
delete from brand_categories
where brand_id in (select id from brands where slug in ('waves', 'prime', 'limora', 'al-tawfeer'));

insert into brand_categories (brand_id, category_id)
select br.id, cat.id
from (values
  ('waves', 'chips-snacks'),
  ('prime', 'spreads-confectionery'),
  ('limora', 'seasonings-food-products'),
  ('al-tawfeer', 'plastic-household-products'),
  ('al-tawfeer', 'paper-hygiene-products')
) as link(brand_slug, category_slug)
join brands br on br.slug = link.brand_slug
join categories cat on cat.slug = link.category_slug;

-- ---------------------------------------------------------------------
-- 4. PRODUCTS
-- ---------------------------------------------------------------------
insert into products (slug, name_en, name_ar, short_description_en, short_description_ar, country_of_origin, size_label, carton_qty, barcode, main_image_url, display_order, brand_id, status)
select v.slug, v.name_en, v.name_ar, v.short_description_en, v.short_description_ar, v.country_of_origin, v.size_label, v.carton_qty, v.barcode, v.main_image_url, v.display_order, br.id, 'published'
from (values
  ('waves-tomato-90g', 'waves', 'WAVES Tomato 90g', 'ويفز طماطم 90g', 'Crispy potato chips with a distinctive, rich tomato flavor.', 'رقائق بطاطس مقرمشة بنكهة الطماطم المميزة، بطعم غني وممتع.', 'Egypt', '90g', '9 pcs', '6222035242260', '/images/products/waves/waves-tomato-90g.png', 1),
  ('waves-chili-lemon-90g', 'waves', 'WAVES Chili & Lemon 90g', 'ويفز فلفل حار وليمون 90g', 'A distinctive combination of spicy chili and a refreshing touch of lemon.', 'مزيج مميز يجمع نكهة الفلفل الحار مع لمسة الليمون المنعشة.', 'Egypt', '90g', '9 pcs', '6222035242284', '/images/products/waves/waves-chili-lemon-90g.png', 2),
  ('waves-seasoned-cheese-90g', 'waves', 'WAVES Seasoned Cheese 90g', 'ويفز جبنة متبلة 90g', 'Crispy potato chips with a rich seasoned cheese flavor.', 'رقائق بطاطس مقرمشة بنكهة الجبنة المتبلة الغنية.', 'Egypt', '90g', '9 pcs', '6222035242277', '/images/products/waves/waves-seasoned-cheese-90g.png', 3),
  ('waves-kebab-90g', 'waves', 'WAVES Kebab 90g', 'ويفز كباب 90g', 'Crispy potato chips with a distinctive, savory kebab flavor.', 'رقائق بطاطس مقرمشة بنكهة الكباب الغنية والمميزة.', 'Egypt', '90g', '9 pcs', '6222035242253', '/images/products/waves/waves-kebab-90g.png', 4),
  ('waves-sweet-chili-90g', 'waves', 'WAVES Sweet Chili 90g', 'ويفز حلو وحار 90g', 'A delicious balance of sweetness and heat with the signature WAVES crunch.', 'توازن لذيذ بين الحلاوة والحرارة مع قرمشة WAVES المميزة.', 'Egypt', '90g', '9 pcs', '6222035242246', '/images/products/waves/waves-sweet-chili-90g.png', 5),
  ('waves-max-fire-90g', 'waves', 'WAVES Max Fire 90g', 'ويفز ماكس فاير 90g', 'A bold and fiery flavor created for those who enjoy an intense spicy taste.', 'نكهة حارة وقوية لمحبي المذاق الجريء.', 'Egypt', '90g', '9 pcs', '6222035242239', '/images/products/waves/waves-max-fire-90g.png', 6),
  ('waves-sweet-chili-42g', 'waves', 'WAVES Sweet Chili 42g', 'ويفز حلو وحار 42g', 'A delicious balance of sweetness and heat with the signature WAVES crunch.', 'توازن لذيذ بين الحلاوة والحرارة مع قرمشة WAVES المميزة.', 'Egypt', '42g', '24 pcs', '6222035242369', '/images/products/waves/waves-sweet-chili-42g.png', 7),
  ('waves-chili-lemon-42g', 'waves', 'WAVES Chili & Lemon 42g', 'ويفز فلفل حار وليمون 42g', 'A distinctive combination of spicy chili and a refreshing touch of lemon.', 'مزيج مميز يجمع نكهة الفلفل الحار مع لمسة الليمون المنعشة.', 'Egypt', '42g', '24 pcs', '6222035242390', '/images/products/waves/waves-chili-lemon-42g.png', 8),
  ('waves-seasoned-cheese-42g', 'waves', 'WAVES Seasoned Cheese 42g', 'ويفز جبنة متبلة 42g', 'Crispy potato chips with a rich seasoned cheese flavor.', 'رقائق بطاطس مقرمشة بنكهة الجبنة المتبلة الغنية.', 'Egypt', '42g', '24 pcs', '6222035242383', '/images/products/waves/waves-seasoned-cheese-42g.png', 9),
  ('waves-kebab-42g', 'waves', 'WAVES Kebab 42g', 'ويفز كباب 42g', 'Crispy potato chips with a distinctive, savory kebab flavor.', 'رقائق بطاطس مقرمشة بنكهة الكباب الغنية والمميزة.', 'Egypt', '42g', '24 pcs', '6222035242376', '/images/products/waves/waves-kebab-42g.png', 10),
  ('waves-tomato-42g', 'waves', 'WAVES Tomato 42g', 'ويفز طماطم 42g', 'Crispy potato chips with a distinctive, rich tomato flavor.', 'رقائق بطاطس مقرمشة بنكهة الطماطم المميزة، بطعم غني وممتع.', 'Egypt', '42g', '24 pcs', '6222035242406', '/images/products/waves/waves-tomato-42g.png', 11),
  ('prime-pistachio-cream-spread-200g', 'prime', 'PRIME Pistachio Cream Spread', 'كريمة الفستق برايم', 'Rich and creamy pistachio spread with a smooth texture and delicious nutty taste. Perfect for desserts, pastries, breakfast and everyday enjoyment.', 'كريمة فستق غنية وكريمية بقوام ناعم ومذاق مميز. مثالية للحلويات والمعجنات والفطور والاستخدام اليومي.', '—', '200g', '24 pcs', '6292556003350', '/images/products/prime/prime-pistachio-cream-200g.jpeg', 1),
  ('prime-pistachio-cream-spread-kunafa-hazelnut-200g', 'prime', 'PRIME Pistachio Cream Spread with Kunafa & Hazelnut', 'كريمة الفستق بالكنافة والبندق برايم', 'A delicious layered combination of pistachio cream, kunafa and hazelnut, inspired by the rich taste of Dubai chocolate.', 'مزيج شهي من كريمة الفستق والكنافة والبندق، مستوحى من المذاق الغني لشوكولاتة دبي.', '—', '200g', '24 pcs', '6298454345431', '/images/products/prime/prime-pistachio-kunafa-hazelnut-200g.jpeg', 2),
  ('prime-crunchy-hazelnut-spread-cocoa-200g', 'prime', 'PRIME Crunchy Hazelnut Spread with Cocoa', 'كريمة البندق المقرمشة بالكاكاو برايم', 'Creamy cocoa and hazelnut spread with a delicious crunchy texture, perfect for toast, desserts, pastries and snacks.', 'كريمة كاكاو وبندق بقوام كريمي ومقرمش، مثالية للتوست والحلويات والمعجنات والوجبات الخفيفة.', '—', '200g', '24 pcs', '6290784543433', '/images/products/prime/prime-crunchy-hazelnut-cocoa-200g.jpg', 3),
  ('limora-lemon-seasoning-1l', 'limora', 'LIMORA Lemon Seasoning', 'منكّه ليمون ليمورا', 'LIMORA Lemon Seasoning delivers a refreshing lemon flavor, perfect for adding a bright citrus touch to salads, seafood, marinades and a variety of dishes. Available in a convenient 1-liter PET bottle.', 'منكّه ليمون LIMORA يمنح نكهة منعشة ومميزة، مثالي لإضافة لمسة حمضية لذيذة إلى السلطات، والمأكولات البحرية، والتتبيلات، ومختلف الأطباق. يأتي في عبوة PET عملية بحجم 1 لتر.', 'UAE', '1 Liter (PET Bottle)', '12 pcs', '6297003250073', '/images/products/limora/limora-lemon-seasoning-1l.jpeg', 1),
  ('al-tawfeer-maxi-roll-350m', 'al-tawfeer', 'Maxi Roll 350m Multi Use', 'ماكسي رول 350 متر متعدد الاستخدامات', 'Practical, reliable AL TAWFEER quality for everyday household needs.', 'جودة عملية وموثوقة من التوفير لتلبية احتياجات المنزل اليومية.', 'Kuwait', '350m', '6 pcs', '2981215008549', '/images/products/al-tawfeer/maxi-roll-350m.jpg', 1),
  ('al-tawfeer-trash-bag-basket-5-gallon', 'al-tawfeer', 'Trash Bag for Basket 5 Gallon', 'كيس قمامة للسلة 5 جالون', 'Practical, reliable AL TAWFEER quality for everyday household needs.', 'جودة عملية وموثوقة من التوفير لتلبية احتياجات المنزل اليومية.', 'Kuwait', '5 rolls / 150 bags / 50×46 cm', '24 pcs', '2730203011210', '/images/products/al-tawfeer/trash-bag-basket-5-gallon.jpg', 2),
  ('al-tawfeer-trash-bag-basket-8-gallon', 'al-tawfeer', 'Trash Bag for Basket 8 Gallon', 'كيس قمامة للسلة 8 جالون', 'Practical, reliable AL TAWFEER quality for everyday household needs.', 'جودة عملية وموثوقة من التوفير لتلبية احتياجات المنزل اليومية.', 'Kuwait', '4 rolls / 120 bags / 58×50 cm', '24 pcs', '2730203011227', '/images/products/al-tawfeer/trash-bag-basket-8-gallon.jpg', 3),
  ('al-tawfeer-trash-bag-basket-10-gallon', 'al-tawfeer', 'Trash Bag for Basket 10 Gallon', 'كيس قمامة للسلة 10 جالون', 'Practical, reliable AL TAWFEER quality for everyday household needs.', 'جودة عملية وموثوقة من التوفير لتلبية احتياجات المنزل اليومية.', 'Kuwait', '3 rolls / 90 bags / 65×52 cm', '24 pcs', '2730203011234', '/images/products/al-tawfeer/trash-bag-basket-10-gallon.jpg', 4),
  ('al-tawfeer-garbage-50-gallon-thick', 'al-tawfeer', 'Garbage 50 Gallon Thick', 'كيس قمامة سميك 50 جالون', 'Practical, reliable AL TAWFEER quality for everyday household needs.', 'جودة عملية وموثوقة من التوفير لتلبية احتياجات المنزل اليومية.', 'Kuwait', '16 bags / 110×85 cm', '20 pcs', '74511085080', '/images/products/al-tawfeer/garbage-50-gallon-thick.jpg', 5),
  ('al-tawfeer-table-cover-3kg', 'al-tawfeer', 'Table Cover 3 KG', 'مفرش سفرة 3 كجم', 'Practical, reliable AL TAWFEER quality for everyday household needs.', 'جودة عملية وموثوقة من التوفير لتلبية احتياجات المنزل اليومية.', 'Kuwait', '1 pc / 120×120 cm', '5 pcs', '1011003030041', '/images/products/al-tawfeer/table-cover-3kg.jpg', 6),
  ('al-tawfeer-table-cover-2kg', 'al-tawfeer', 'Table Cover 2 KG', 'مفرش سفرة 2 كجم', 'Practical, reliable AL TAWFEER quality for everyday household needs.', 'جودة عملية وموثوقة من التوفير لتلبية احتياجات المنزل اليومية.', 'Kuwait', '1 pc / 110×100 cm', '10 pcs', '220030045014', '/images/products/al-tawfeer/table-cover-2kg.jpg', 7),
  ('al-tawfeer-table-cover-15-sheets', 'al-tawfeer', 'Table Cover 15 Sheets', 'مفرش سفرة 15 ورقة', 'Practical, reliable AL TAWFEER quality for everyday household needs.', 'جودة عملية وموثوقة من التوفير لتلبية احتياجات المنزل اليومية.', 'Kuwait', '15 sheets / 110×100 cm', '15 pcs', '2020002040044', '/images/products/al-tawfeer/table-cover-15-sheets.jpg', 8),
  ('al-tawfeer-maxi-roll-extra-soft-twin-pack', 'al-tawfeer', 'Maxi Roll Extra Soft Twin Pack', 'ماكسي رول ناعم إضافي - عبوة توأم', 'Practical, reliable AL TAWFEER quality for everyday household needs.', 'جودة عملية وموثوقة من التوفير لتلبية احتياجات المنزل اليومية.', 'Kuwait', '100% virgin pulp / 2 rolls', '3 pcs', '2981215008550', '/images/products/al-tawfeer/maxi-roll-extra-soft-twin-pack.jpg', 9),
  ('al-tawfeer-toilet-paper-extra-value', 'al-tawfeer', 'Toilet Paper Roll Extra Value', 'ورق تواليت اقتصادي', 'Practical, reliable AL TAWFEER quality for everyday household needs.', 'جودة عملية وموثوقة من التوفير لتلبية احتياجات المنزل اليومية.', 'Kuwait', '100% virgin pulp / 200 sheets', '10 pcs', '2981215008551', '/images/products/al-tawfeer/toilet-paper-extra-value.jpeg', 10),
  ('al-tawfeer-table-cover-4pcs-25m', 'al-tawfeer', 'Table Cover 4 PCS / 25m', 'مفرش سفرة 4 قطع / 25 متر', 'Practical, reliable AL TAWFEER quality for everyday household needs.', 'جودة عملية وموثوقة من التوفير لتلبية احتياجات المنزل اليومية.', 'Kuwait', '110×110 cm', '10 pcs', '3000901014158', '/images/products/al-tawfeer/table-cover-4pcs-25m.jpg', 11),
  ('al-tawfeer-table-cover-3pcs-600g', 'al-tawfeer', 'Table Cover 3 PCS / 600g', 'مفرش سفرة 3 قطع / 600 جرام', 'Practical, reliable AL TAWFEER quality for everyday household needs.', 'جودة عملية وموثوقة من التوفير لتلبية احتياجات المنزل اليومية.', 'Kuwait', '110×110 cm', '10 pcs', '3000901014165', '/images/products/al-tawfeer/table-cover-3pcs-600g.jpg', 12),
  ('al-tawfeer-garbage-50-gallon-thick-twin-pack', 'al-tawfeer', 'Garbage 50 Gallon Thick Twin Pack', 'كيس قمامة سميك 50 جالون - عبوة توأم', 'Practical, reliable AL TAWFEER quality for everyday household needs.', 'جودة عملية وموثوقة من التوفير لتلبية احتياجات المنزل اليومية.', 'Kuwait', '2 pcs / 20 bags / 110×85 cm', '15 pcs', '245365862331', '/images/products/al-tawfeer/garbage-50-gallon-thick.jpg', 13)
) as v(slug, brand_slug, name_en, name_ar, short_description_en, short_description_ar, country_of_origin, size_label, carton_qty, barcode, main_image_url, display_order)
join brands br on br.slug = v.brand_slug
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  short_description_en = excluded.short_description_en,
  short_description_ar = excluded.short_description_ar,
  country_of_origin = excluded.country_of_origin,
  size_label = excluded.size_label,
  carton_qty = excluded.carton_qty,
  barcode = excluded.barcode,
  main_image_url = excluded.main_image_url,
  display_order = excluded.display_order,
  brand_id = excluded.brand_id,
  status = excluded.status;

-- ---------------------------------------------------------------------
-- 5. PRODUCT_CATEGORIES (delete + reinsert, scoped to seeded products)
-- ---------------------------------------------------------------------
delete from product_categories
where product_id in (select id from products where slug in (
  'waves-tomato-90g',
  'waves-chili-lemon-90g',
  'waves-seasoned-cheese-90g',
  'waves-kebab-90g',
  'waves-sweet-chili-90g',
  'waves-max-fire-90g',
  'waves-sweet-chili-42g',
  'waves-chili-lemon-42g',
  'waves-seasoned-cheese-42g',
  'waves-kebab-42g',
  'waves-tomato-42g',
  'prime-pistachio-cream-spread-200g',
  'prime-pistachio-cream-spread-kunafa-hazelnut-200g',
  'prime-crunchy-hazelnut-spread-cocoa-200g',
  'limora-lemon-seasoning-1l',
  'al-tawfeer-maxi-roll-350m',
  'al-tawfeer-trash-bag-basket-5-gallon',
  'al-tawfeer-trash-bag-basket-8-gallon',
  'al-tawfeer-trash-bag-basket-10-gallon',
  'al-tawfeer-garbage-50-gallon-thick',
  'al-tawfeer-table-cover-3kg',
  'al-tawfeer-table-cover-2kg',
  'al-tawfeer-table-cover-15-sheets',
  'al-tawfeer-maxi-roll-extra-soft-twin-pack',
  'al-tawfeer-toilet-paper-extra-value',
  'al-tawfeer-table-cover-4pcs-25m',
  'al-tawfeer-table-cover-3pcs-600g',
  'al-tawfeer-garbage-50-gallon-thick-twin-pack'
));

insert into product_categories (product_id, category_id)
select pr.id, cat.id
from (values
  ('waves-tomato-90g', 'chips-snacks'),
  ('waves-chili-lemon-90g', 'chips-snacks'),
  ('waves-seasoned-cheese-90g', 'chips-snacks'),
  ('waves-kebab-90g', 'chips-snacks'),
  ('waves-sweet-chili-90g', 'chips-snacks'),
  ('waves-max-fire-90g', 'chips-snacks'),
  ('waves-sweet-chili-42g', 'chips-snacks'),
  ('waves-chili-lemon-42g', 'chips-snacks'),
  ('waves-seasoned-cheese-42g', 'chips-snacks'),
  ('waves-kebab-42g', 'chips-snacks'),
  ('waves-tomato-42g', 'chips-snacks'),
  ('prime-pistachio-cream-spread-200g', 'spreads-confectionery'),
  ('prime-pistachio-cream-spread-kunafa-hazelnut-200g', 'spreads-confectionery'),
  ('prime-crunchy-hazelnut-spread-cocoa-200g', 'spreads-confectionery'),
  ('limora-lemon-seasoning-1l', 'seasonings-food-products'),
  ('al-tawfeer-maxi-roll-350m', 'paper-hygiene-products'),
  ('al-tawfeer-trash-bag-basket-5-gallon', 'plastic-household-products'),
  ('al-tawfeer-trash-bag-basket-8-gallon', 'plastic-household-products'),
  ('al-tawfeer-trash-bag-basket-10-gallon', 'plastic-household-products'),
  ('al-tawfeer-garbage-50-gallon-thick', 'plastic-household-products'),
  ('al-tawfeer-table-cover-3kg', 'plastic-household-products'),
  ('al-tawfeer-table-cover-2kg', 'plastic-household-products'),
  ('al-tawfeer-table-cover-15-sheets', 'plastic-household-products'),
  ('al-tawfeer-maxi-roll-extra-soft-twin-pack', 'paper-hygiene-products'),
  ('al-tawfeer-toilet-paper-extra-value', 'paper-hygiene-products'),
  ('al-tawfeer-table-cover-4pcs-25m', 'plastic-household-products'),
  ('al-tawfeer-table-cover-3pcs-600g', 'plastic-household-products'),
  ('al-tawfeer-garbage-50-gallon-thick-twin-pack', 'plastic-household-products')
) as link(product_slug, category_slug)
join products pr on pr.slug = link.product_slug
join categories cat on cat.slug = link.category_slug;

-- ---------------------------------------------------------------------
-- 6. PRODUCT_IMAGES (gallery) — only products with a defined gallery are
--    touched; delete + reinsert is scoped to that single product, exactly
--    like scripts/seed.ts (products without a gallery entry are never
--    touched here, so admin-added gallery images on them are preserved).
-- ---------------------------------------------------------------------
delete from product_images
where product_id = (select id from products where slug = 'waves-chili-lemon-90g');

insert into product_images (product_id, image_url, alt_text_en, alt_text_ar, sort_order)
values
  ((select id from products where slug = 'waves-chili-lemon-90g'), '/images/products/waves/waves-chili-lemon-90g-back.png', 'WAVES Chili & Lemon 90g — additional view', 'ويفز فلفل حار وليمون 90g — صورة إضافية', 0);

delete from product_images
where product_id = (select id from products where slug = 'waves-seasoned-cheese-90g');

insert into product_images (product_id, image_url, alt_text_en, alt_text_ar, sort_order)
values
  ((select id from products where slug = 'waves-seasoned-cheese-90g'), '/images/products/waves/waves-seasoned-cheese-90g-back.png', 'WAVES Seasoned Cheese 90g — additional view', 'ويفز جبنة متبلة 90g — صورة إضافية', 0);

delete from product_images
where product_id = (select id from products where slug = 'waves-kebab-90g');

insert into product_images (product_id, image_url, alt_text_en, alt_text_ar, sort_order)
values
  ((select id from products where slug = 'waves-kebab-90g'), '/images/products/waves/waves-kebab-90g-back.png', 'WAVES Kebab 90g — additional view', 'ويفز كباب 90g — صورة إضافية', 0);

delete from product_images
where product_id = (select id from products where slug = 'waves-max-fire-90g');

insert into product_images (product_id, image_url, alt_text_en, alt_text_ar, sort_order)
values
  ((select id from products where slug = 'waves-max-fire-90g'), '/images/products/waves/waves-max-fire-90g-back.png', 'WAVES Max Fire 90g — additional view', 'ويفز ماكس فاير 90g — صورة إضافية', 0);

delete from product_images
where product_id = (select id from products where slug = 'waves-sweet-chili-42g');

insert into product_images (product_id, image_url, alt_text_en, alt_text_ar, sort_order)
values
  ((select id from products where slug = 'waves-sweet-chili-42g'), '/images/products/waves/waves-sweet-chili-42g-back.png', 'WAVES Sweet Chili 42g — additional view', 'ويفز حلو وحار 42g — صورة إضافية', 0);

delete from product_images
where product_id = (select id from products where slug = 'waves-tomato-42g');

insert into product_images (product_id, image_url, alt_text_en, alt_text_ar, sort_order)
values
  ((select id from products where slug = 'waves-tomato-42g'), '/images/products/waves/waves-tomato-42g-back.png', 'WAVES Tomato 42g — additional view', 'ويفز طماطم 42g — صورة إضافية', 0);

delete from product_images
where product_id = (select id from products where slug = 'al-tawfeer-garbage-50-gallon-thick');

insert into product_images (product_id, image_url, alt_text_en, alt_text_ar, sort_order)
values
  ((select id from products where slug = 'al-tawfeer-garbage-50-gallon-thick'), '/images/products/al-tawfeer/garbage-50-gallon-thick-alt.jpg', 'Garbage 50 Gallon Thick — additional view', 'كيس قمامة سميك 50 جالون — صورة إضافية', 0);

-- ---------------------------------------------------------------------
-- 7. PAGES
-- ---------------------------------------------------------------------
insert into pages (slug, title_en, title_ar, content, seo_title_en, seo_title_ar, seo_description_en, seo_description_ar)
values
  ('home', 'Home', 'الرئيسية', '{"hero": {"heading_en": "Connecting Quality Products with the Markets They Deserve.", "heading_ar": "نربط المنتجات المميزة بالأسواق التي تستحقها.", "subtext_en": "A UAE-based trading and distribution company specializing in food and consumer products, supported by a growing distribution network of more than 400 clients.", "subtext_ar": "شركة متخصصة في تجارة وتوزيع المنتجات الغذائية والاستهلاكية في دولة الإمارات، مدعومة بشبكة توزيع متنامية تضم أكثر من 400 عميل.", "cta_primary_en": "Explore Our Products", "cta_primary_ar": "استكشف منتجاتنا", "cta_secondary_en": "Become a Partner", "cta_secondary_ar": "كن شريكًا", "highlights": [{"en": "400+ UAE Clients", "ar": "أكثر من 400 عميل في الإمارات"}, {"en": "Business roots since 1995", "ar": "جذور أعمال منذ عام 1995"}, {"en": "4 current brands", "ar": "4 علامات تجارية حالية"}, {"en": "Growing distribution network", "ar": "شبكة توزيع متنامية"}]}, "categories_heading_en": "Selected Products for Today''s Market Needs", "categories_heading_ar": "منتجات مختارة لتلبية احتياجات السوق", "brands_heading_en": "Brands Built for Growth", "brands_heading_ar": "علامات تجارية نبني معها قيمة حقيقية في السوق", "brands_subtext_en": "Gold Gravity represents a growing portfolio of brands across food and consumer product categories, with a focus on quality, strong products, and effective market reach.", "brands_subtext_ar": "تمثل جولد جرافيتي محفظة متنامية من العلامات التجارية عبر فئات المنتجات الغذائية والاستهلاكية، مع التركيز على الجودة والمنتجات القوية والوصول الفعّال إلى السوق.", "about_heading_en": "Your Trading & Distribution Partner in the UAE", "about_heading_ar": "شريكك في التجارة والتوزيع داخل الإمارات", "about_text_en": "Gold Gravity Trading specializes in the trading and distribution of food and consumer products across the United Arab Emirates, serving a growing network of more than 400 clients. With business roots and experience extending to Kuwait since 1995, we continue to strengthen our UAE presence through a diverse product portfolio, growing brands, and partnerships built on quality, trust, and reliable supply.", "about_text_ar": "شركة Gold Gravity Trading متخصصة في تجارة وتوزيع المنتجات الغذائية والاستهلاكية في دولة الإمارات العربية المتحدة، مع تركيز واضح على بناء علامات تجارية قوية وتوفير منتجات تلبي احتياجات السوق. نخدم اليوم شبكة متنامية تضم أكثر من 400 عميل في دولة الإمارات، ونعمل باستمرار على توسيع نطاق التوزيع وإضافة منتجات وعلامات تجارية جديدة إلى محفظتنا. تمتد جذور وخبرة أعمال Gold Gravity إلى الكويت منذ عام 1995، حيث يتواجد نشاطنا أيضًا في قطاع تصنيع المنتجات البلاستيكية.", "manufacturing_heading_en": "Manufacturing Experience Behind Our Business", "manufacturing_heading_ar": "خبرة في التصنيع تدعم قوة أعمالنا", "manufacturing_text_en": "Gold Gravity''s experience extends to plastic products manufacturing in Kuwait, covering a wide range of plastic and packaging solutions for commercial and consumer applications. This manufacturing background gives us a direct understanding of quality, market requirements and customer needs, supporting our UAE trading and distribution operations.", "manufacturing_text_ar": "تمتد خبرة Gold Gravity إلى قطاع تصنيع المنتجات البلاستيكية في الكويت، حيث تشمل مجموعة واسعة من حلول البلاستيك والتعبئة المخصصة للاستخدامات التجارية والاستهلاكية. هذه الخبرة تمنحنا فهمًا مباشرًا لمتطلبات الجودة، احتياجات السوق، ومتطلبات العملاء، وتدعم أعمالنا في التجارة والتوزيع داخل دولة الإمارات.", "manufacturing_keywords": [{"en": "Quality", "ar": "الجودة"}, {"en": "Flexibility", "ar": "المرونة"}, {"en": "Experience", "ar": "الخبرة"}], "distribution_heading_en": "From Warehouse to Market", "distribution_heading_ar": "من المخزن إلى نقاط البيع", "distribution_text_en": "Gold Gravity operates a growing distribution network serving more than 400 clients across the UAE, delivering products efficiently across multiple retail and sales channels. Through organized warehousing, reliable supply and direct market follow-up, we work to strengthen the presence of our products and brands.", "distribution_text_ar": "تمتلك Gold Gravity شبكة توزيع متنامية تخدم أكثر من 400 عميل في دولة الإمارات، وتعمل على إيصال منتجاتها إلى مختلف قنوات البيع بكفاءة وسرعة. من خلال التخزين المنظم، التوريد المستمر، والمتابعة المباشرة للسوق، نعمل على بناء حضور قوي لمنتجاتنا وعلاماتنا التجارية.", "partnership_heading_en": "Your Product Deserves Stronger Market Reach", "partnership_heading_ar": "منتجك يستحق وصولاً أقوى إلى السوق", "partnership_text_en": "If you are a manufacturer, supplier or brand owner with a product ready for the UAE market, Gold Gravity can explore opportunities to become your distribution and market-access partner.", "partnership_text_ar": "إذا كنت مصنّعًا، موردًا أو صاحب علامة تجارية ولديك منتج جاهز للسوق الإماراتي، يمكن لـ Gold Gravity أن تكون شريكك في التوزيع والوصول إلى السوق. ندرس المنتج وفرصه في السوق ونبحث إمكانية التعاون وفق نموذج تجاري مناسب للطرفين.", "partnership_cta_primary_en": "Submit Your Product", "partnership_cta_primary_ar": "قدّم منتجك", "partnership_cta_secondary_en": "Talk to Our Team", "partnership_cta_secondary_ar": "تحدث مع فريقنا", "why_heading_en": "Why Gold Gravity?", "why_heading_ar": "لماذا جولد جرافيتي؟", "why_pillars": [{"title_en": "400+ UAE Clients", "title_ar": "أكثر من 400 عميل في الإمارات", "text_en": "Growing distribution network serving more than 400 clients across the UAE.", "text_ar": "شبكة توزيع متنامية تخدم أكثر من 400 عميل في جميع أنحاء الإمارات."}, {"title_en": "Quality", "title_ar": "الجودة", "text_en": "Products selected to deliver quality and real market value.", "text_ar": "منتجات مختارة لتقديم الجودة والقيمة الحقيقية في السوق."}, {"title_en": "Reliable Supply", "title_ar": "توريد موثوق", "text_en": "Efficient order handling and dependable product availability.", "text_ar": "معالجة فعّالة للطلبات وتوافر موثوق للمنتجات."}, {"title_en": "Diverse Portfolio", "title_ar": "محفظة متنوعة", "text_en": "Food, snacks, seasonings, plastic, household and paper products.", "text_ar": "منتجات غذائية ووجبات خفيفة ومنكهات ومنتجات بلاستيكية ومنزلية وورقية."}, {"title_en": "Experience", "title_ar": "الخبرة", "text_en": "Business experience extending from Kuwait since 1995, with focus on UAE growth.", "text_ar": "خبرة أعمال تمتد من الكويت منذ عام 1995، مع تركيز على النمو في الإمارات."}], "final_cta_heading_en": "Ready to Do Business Together?", "final_cta_heading_ar": "جاهزون لبدء أعمال جديدة معك؟", "final_cta_text_en": "Whether you are looking to source our products, request a quotation, or explore distribution opportunities for your brand in the UAE, the Gold Gravity Trading team is ready to connect with you.", "final_cta_text_ar": "سواء كنت تبحث عن منتجات للتوريد، ترغب في الحصول على عرض سعر، أو تبحث عن شريك لتوزيع منتجاتك في دولة الإمارات، فريق Gold Gravity Trading جاهز للتواصل معك."}'::jsonb, 'Gold Gravity Trading LLC | Food & Consumer Products Distributor UAE', 'جولد جرافيتي للتجارة | موزع منتجات غذائية واستهلاكية في الإمارات', 'Gold Gravity Trading LLC supplies and distributes food, snacks, confectionery, seasonings, plastic and household products across the UAE, serving a growing network of 400+ clients.', 'شركة جولد جرافيتي للتجارة توفر وتوزع المنتجات الغذائية والوجبات الخفيفة والحلويات والمنكهات والمنتجات البلاستيكية والمنزلية في جميع أنحاء الإمارات، وتخدم شبكة متنامية تضم أكثر من 400 عميل.'),
  ('about', 'About Us', 'من نحن', '{"intro_en": "Gold Gravity Trading LLC specializes in the trading and distribution of food and consumer products in the United Arab Emirates, with a clear focus on building strong brands and supplying products that meet market needs. We currently serve a growing network of more than 400 clients in the UAE and continuously expand our distribution reach and brand portfolio. Gold Gravity''s business roots and experience extend to Kuwait since 1995, including experience in plastic products manufacturing. In the UAE, our focus is trading, distribution, brand development and market access, building long-term relationships with customers, suppliers and manufacturers.", "intro_ar": "شركة Gold Gravity Trading LLC متخصصة في تجارة وتوزيع المنتجات الغذائية والاستهلاكية في دولة الإمارات العربية المتحدة، مع تركيز واضح على بناء علامات تجارية قوية وتوفير منتجات تلبي احتياجات السوق. نخدم اليوم شبكة متنامية تضم أكثر من 400 عميل في دولة الإمارات، ونعمل باستمرار على توسيع نطاق التوزيع وإضافة منتجات وعلامات تجارية جديدة إلى محفظتنا. تمتد جذور وخبرة أعمال Gold Gravity إلى الكويت منذ عام 1995، بما في ذلك خبرة في قطاع تصنيع المنتجات البلاستيكية. في الإمارات، نركز على التجارة، التوزيع، تطوير العلامات التجارية والوصول إلى السوق، ونسعى إلى بناء علاقات طويلة الأمد مع العملاء والموردين والمصنعين.", "vision_en": "To build Gold Gravity into a globally recognized trading and distribution name through strong products, sustainable partnerships and continuous market expansion.", "vision_ar": "بناء Gold Gravity كاسم عالمي في التجارة والتوزيع، من خلال منتجات قوية، شراكات مستدامة، وتوسيع مستمر في الأسواق.", "mission_en": "To provide quality products with competitive value, bring them to market efficiently and reliably, and build partnerships that create sustainable growth for all parties.", "mission_ar": "توفير منتجات ذات جودة وقيمة تنافسية، والوصول بها إلى السوق بكفاءة وسرعة، مع بناء شراكات تحقق نموًا مستدامًا لجميع الأطراف.", "values": [{"en": "Quality", "ar": "الجودة"}, {"en": "Trust", "ar": "الثقة"}, {"en": "Speed", "ar": "السرعة"}, {"en": "Commitment", "ar": "الالتزام"}, {"en": "Growth", "ar": "النمو"}]}'::jsonb, 'About Gold Gravity Trading LLC | UAE Trading & Distribution', 'عن جولد جرافيتي للتجارة | التجارة والتوزيع في الإمارات', 'Learn about Gold Gravity Trading LLC, serving 400+ UAE clients with business roots and experience extending to Kuwait since 1995.', 'تعرف على شركة جولد جرافيتي للتجارة، التي تخدم أكثر من 400 عميل في الإمارات وتمتد جذور خبرتها إلى الكويت منذ عام 1995.'),
  ('partnership', 'Distribution Partnership', 'شراكة التوزيع', '{"heading_en": "A Strong Product Deserves a Strong Distribution Partner", "heading_ar": "منتج قوي يستحق شريك توزيع قوي", "intro_en": "If you are a manufacturer, supplier, or brand owner looking to expand your products into the UAE, Gold Gravity Trading welcomes opportunities to explore distribution and market-entry partnerships. We evaluate the product, category, competitiveness and market potential before exploring a suitable commercial partnership model. Supported by a growing network of more than 400 clients across the UAE and our trading and distribution experience, we aim to turn promising products into sustainable market opportunities.", "intro_ar": "إذا كنت مصنّعًا أو موردًا أو صاحب علامة تجارية وتتطلع لتوسيع منتجاتك في السوق الإماراتي، ترحب Gold Gravity Trading باستكشاف فرص الشراكة في التوزيع ودخول السوق. نقوم بتقييم المنتج والفئة والقدرة التنافسية وإمكانات السوق قبل استكشاف نموذج شراكة تجارية مناسب. وبدعم من شبكتنا المتنامية التي تضم أكثر من 400 عميل في الإمارات وخبرتنا في التجارة والتوزيع، نسعى إلى تحويل المنتجات الواعدة إلى فرص مستدامة في السوق.", "process": [{"en": "Submit your product / catalogue / pricing", "ar": "قدّم منتجك / الكتالوج / التسعير"}, {"en": "Market and category review", "ar": "مراجعة السوق والفئة"}, {"en": "Commercial model and agreement", "ar": "النموذج التجاري والاتفاقية"}, {"en": "Market entry / distribution plan", "ar": "خطة دخول السوق / التوزيع"}], "disclaimer_en": "Submission does not mean automatic acceptance for distribution. All opportunities are subject to review and commercial agreement.", "disclaimer_ar": "تقديم الطلب لا يعني قبولًا تلقائيًا للتوزيع. تخضع جميع الفرص للمراجعة والاتفاق التجاري."}'::jsonb, 'Distribution Partner in UAE | Gold Gravity Trading', 'شريك التوزيع في الإمارات | جولد جرافيتي للتجارة', 'Manufacturer, supplier or brand owner? Explore distribution and UAE market-entry partnership opportunities with Gold Gravity.', 'هل أنت مصنّع أو مورد أو صاحب علامة تجارية؟ استكشف فرص الشراكة في التوزيع ودخول السوق الإماراتي مع جولد جرافيتي.'),
  ('request-a-quote', 'Request a Quote', 'طلب عرض سعر', '{"heading_en": "Request a Quote for Our Products", "heading_ar": "اطلب عرض سعر لمنتجاتنا", "intro_en": "Interested in adding Gold Gravity products to your store or retail network? Select the products and required quantities, submit your request, and our sales team will review your inquiry and contact you with the appropriate commercial offer.", "intro_ar": "هل ترغب في إضافة منتجات جولد جرافيتي إلى متجرك أو شبكة البيع بالتجزئة الخاصة بك؟ حدد المنتجات والكميات المطلوبة، وأرسل طلبك، وسيقوم فريق المبيعات لدينا بمراجعة استفسارك والتواصل معك بالعرض التجاري المناسب."}'::jsonb, 'Request a Wholesale Quote | Gold Gravity UAE', 'طلب عرض سعر بالجملة | جولد جرافيتي الإمارات', 'Request a wholesale quotation for WAVES, PRIME, LIMORA and AL TAWFEER products in the UAE.', 'اطلب عرض سعر بالجملة لمنتجات ويفز وبرايم وليمورا والتوفير في الإمارات.'),
  ('contact', 'Contact Us', 'اتصل بنا', '{"heading_en": "Ready to Do Business Together?", "heading_ar": "جاهزون لبدء أعمال جديدة معك؟", "intro_en": "Whether you are looking to source our products, request a quotation, or explore distribution opportunities for your brand in the UAE, the Gold Gravity Trading team is ready to connect with you.", "intro_ar": "سواء كنت تبحث عن منتجات للتوريد، ترغب في الحصول على عرض سعر، أو تبحث عن شريك لتوزيع منتجاتك في دولة الإمارات، فريق Gold Gravity Trading جاهز للتواصل معك."}'::jsonb, 'Contact Gold Gravity Trading LLC | UAE', 'تواصل مع جولد جرافيتي للتجارة | الإمارات', 'Contact Gold Gravity for product enquiries, wholesale supply, quotations and distribution partnerships in the UAE.', 'تواصل مع جولد جرافيتي للاستفسار عن المنتجات والتوريد بالجملة وعروض الأسعار وشراكات التوزيع في الإمارات.')
on conflict (slug) do update set
  title_en = excluded.title_en,
  title_ar = excluded.title_ar,
  content = excluded.content,
  seo_title_en = excluded.seo_title_en,
  seo_title_ar = excluded.seo_title_ar,
  seo_description_en = excluded.seo_description_en,
  seo_description_ar = excluded.seo_description_ar;

-- ---------------------------------------------------------------------
-- 8. SITE_SETTINGS (single row, id = 1) — only the columns scripts/seed.ts
--    sets defaults for; address/social/GA fields are left untouched so an
--    admin's existing edits to them survive a re-seed.
-- ---------------------------------------------------------------------
insert into site_settings (id, whatsapp_number, call_number, email, working_hours_en, working_hours_ar, default_seo_title_en, default_seo_title_ar, default_seo_description_en, default_seo_description_ar, logo_url)
values (1, '971505023438', '+971505044805', 'info@goldgravityuae.com', 'Monday–Saturday, 8:00 AM–6:00 PM. Sunday: Closed', 'الإثنين–السبت، 8:00 صباحًا–6:00 مساءً. الأحد: مغلق', 'Gold Gravity Trading LLC | Food & Consumer Products Distributor UAE', 'جولد جرافيتي للتجارة | موزع منتجات غذائية واستهلاكية في الإمارات', 'Gold Gravity Trading LLC supplies and distributes food, snacks, confectionery, seasonings, plastic and household products across the UAE, serving a growing network of 400+ clients.', 'شركة جولد جرافيتي للتجارة توفر وتوزع المنتجات الغذائية والوجبات الخفيفة والحلويات والمنكهات والمنتجات البلاستيكية والمنزلية في جميع أنحاء الإمارات.', '/images/logos/gold-gravity-logo.jpeg')
on conflict (id) do update set
  whatsapp_number = excluded.whatsapp_number,
  call_number = excluded.call_number,
  email = excluded.email,
  working_hours_en = excluded.working_hours_en,
  working_hours_ar = excluded.working_hours_ar,
  default_seo_title_en = excluded.default_seo_title_en,
  default_seo_title_ar = excluded.default_seo_title_ar,
  default_seo_description_en = excluded.default_seo_description_en,
  default_seo_description_ar = excluded.default_seo_description_ar,
  logo_url = excluded.logo_url;

commit;
