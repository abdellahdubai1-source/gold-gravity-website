-- =====================================================================
-- GOLD GRAVITY TRADING LLC — ROW LEVEL SECURITY POLICIES
-- =====================================================================
-- Run after schema.sql. This locks every table down by default and
-- grants only the narrow access the public website and admin
-- dashboard actually need:
--   * Public (anon) visitors can READ published catalogue content and
--     INSERT into the three lead-generation tables — nothing else.
--   * Authenticated admins (rows in admin_profiles) get full CRUD.
-- =====================================================================

alter table categories enable row level security;
alter table brands enable row level security;
alter table brand_categories enable row level security;
alter table products enable row level security;
alter table product_categories enable row level security;
alter table product_images enable row level security;
alter table pages enable row level security;
alter table site_settings enable row level security;
alter table quote_requests enable row level security;
alter table partnership_submissions enable row level security;
alter table contact_submissions enable row level security;
alter table admin_profiles enable row level security;

-- ---------------------------------------------------------------------
-- Helper: is the current user an admin?
-- ---------------------------------------------------------------------
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from admin_profiles where id = auth.uid()
  );
$$ language sql security definer stable;

-- ---------------------------------------------------------------------
-- CATEGORIES — public read (published only), admin full access
-- ---------------------------------------------------------------------
create policy "categories_public_read" on categories
  for select using (is_published = true or is_admin());
create policy "categories_admin_write" on categories
  for insert with check (is_admin());
create policy "categories_admin_update" on categories
  for update using (is_admin());
create policy "categories_admin_delete" on categories
  for delete using (is_admin());

-- ---------------------------------------------------------------------
-- BRANDS
-- ---------------------------------------------------------------------
create policy "brands_public_read" on brands
  for select using (is_published = true or is_admin());
create policy "brands_admin_write" on brands
  for insert with check (is_admin());
create policy "brands_admin_update" on brands
  for update using (is_admin());
create policy "brands_admin_delete" on brands
  for delete using (is_admin());

-- ---------------------------------------------------------------------
-- BRAND_CATEGORIES
-- ---------------------------------------------------------------------
create policy "brand_categories_public_read" on brand_categories
  for select using (true);
create policy "brand_categories_admin_write" on brand_categories
  for insert with check (is_admin());
create policy "brand_categories_admin_delete" on brand_categories
  for delete using (is_admin());

-- ---------------------------------------------------------------------
-- PRODUCTS
-- ---------------------------------------------------------------------
create policy "products_public_read" on products
  for select using (status = 'published' or is_admin());
create policy "products_admin_write" on products
  for insert with check (is_admin());
create policy "products_admin_update" on products
  for update using (is_admin());
create policy "products_admin_delete" on products
  for delete using (is_admin());

-- ---------------------------------------------------------------------
-- PRODUCT_CATEGORIES
-- ---------------------------------------------------------------------
create policy "product_categories_public_read" on product_categories
  for select using (true);
create policy "product_categories_admin_write" on product_categories
  for insert with check (is_admin());
create policy "product_categories_admin_delete" on product_categories
  for delete using (is_admin());

-- ---------------------------------------------------------------------
-- PRODUCT_IMAGES
-- ---------------------------------------------------------------------
create policy "product_images_public_read" on product_images
  for select using (true);
create policy "product_images_admin_write" on product_images
  for insert with check (is_admin());
create policy "product_images_admin_update" on product_images
  for update using (is_admin());
create policy "product_images_admin_delete" on product_images
  for delete using (is_admin());

-- ---------------------------------------------------------------------
-- PAGES
-- ---------------------------------------------------------------------
create policy "pages_public_read" on pages
  for select using (true);
create policy "pages_admin_write" on pages
  for insert with check (is_admin());
create policy "pages_admin_update" on pages
  for update using (is_admin());

-- ---------------------------------------------------------------------
-- SITE_SETTINGS
-- ---------------------------------------------------------------------
create policy "settings_public_read" on site_settings
  for select using (true);
create policy "settings_admin_update" on site_settings
  for update using (is_admin());

-- ---------------------------------------------------------------------
-- QUOTE_REQUESTS — public can only INSERT, only admins can read/manage
-- ---------------------------------------------------------------------
create policy "quote_requests_public_insert" on quote_requests
  for insert with check (true);
create policy "quote_requests_admin_read" on quote_requests
  for select using (is_admin());
create policy "quote_requests_admin_update" on quote_requests
  for update using (is_admin());
create policy "quote_requests_admin_delete" on quote_requests
  for delete using (is_admin());

-- ---------------------------------------------------------------------
-- PARTNERSHIP_SUBMISSIONS
-- ---------------------------------------------------------------------
create policy "partnership_public_insert" on partnership_submissions
  for insert with check (true);
create policy "partnership_admin_read" on partnership_submissions
  for select using (is_admin());
create policy "partnership_admin_update" on partnership_submissions
  for update using (is_admin());
create policy "partnership_admin_delete" on partnership_submissions
  for delete using (is_admin());

-- ---------------------------------------------------------------------
-- CONTACT_SUBMISSIONS
-- ---------------------------------------------------------------------
create policy "contact_public_insert" on contact_submissions
  for insert with check (true);
create policy "contact_admin_read" on contact_submissions
  for select using (is_admin());
create policy "contact_admin_update" on contact_submissions
  for update using (is_admin());
create policy "contact_admin_delete" on contact_submissions
  for delete using (is_admin());

-- ---------------------------------------------------------------------
-- ADMIN_PROFILES — admins can read the roster; nobody can self-escalate
-- (add new admins via the Supabase dashboard / service role only)
-- ---------------------------------------------------------------------
create policy "admin_profiles_self_read" on admin_profiles
  for select using (auth.uid() = id or is_admin());

-- ---------------------------------------------------------------------
-- STORAGE POLICIES
-- ---------------------------------------------------------------------
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');
create policy "media_admin_write" on storage.objects
  for insert with check (bucket_id = 'media' and is_admin());
create policy "media_admin_update" on storage.objects
  for update using (bucket_id = 'media' and is_admin());
create policy "media_admin_delete" on storage.objects
  for delete using (bucket_id = 'media' and is_admin());

create policy "partnership_uploads_public_insert" on storage.objects
  for insert with check (bucket_id = 'partnership-uploads');
create policy "partnership_uploads_admin_read" on storage.objects
  for select using (bucket_id = 'partnership-uploads' and is_admin());
