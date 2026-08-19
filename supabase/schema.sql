-- =====================================================================
-- GOLD GRAVITY TRADING LLC — DATABASE SCHEMA
-- =====================================================================
-- Run this file first in the Supabase SQL editor (or via the CLI:
--   supabase db push
-- ), then run policies.sql, then run `npm run seed` to load the
-- initial approved catalogue from the developer brief.
-- =====================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Helper: auto-maintained updated_at
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------
-- CATEGORIES
-- ---------------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_ar text not null,
  description_en text,
  description_ar text,
  image_url text,
  display_order integer not null default 0,
  seo_title_en text,
  seo_title_ar text,
  seo_description_en text,
  seo_description_ar text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_categories_updated_at before update on categories
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- BRANDS
-- ---------------------------------------------------------------------
create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  brand_line_en text,
  brand_line_ar text,
  description_en text,
  description_ar text,
  logo_url text,
  hero_image_url text,
  country_of_origin text,
  display_order integer not null default 0,
  seo_title_en text,
  seo_title_ar text,
  seo_description_en text,
  seo_description_ar text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_brands_updated_at before update on brands
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- BRAND <-> CATEGORY (many-to-many)
-- ---------------------------------------------------------------------
create table if not exists brand_categories (
  brand_id uuid not null references brands(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  primary key (brand_id, category_id)
);

-- ---------------------------------------------------------------------
-- PRODUCTS
-- ---------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  brand_id uuid not null references brands(id) on delete restrict,
  name_en text not null,
  name_ar text not null,
  short_description_en text,
  short_description_ar text,
  country_of_origin text,
  size_label text,
  carton_qty text,
  barcode text,
  main_image_url text,
  status text not null default 'draft' check (status in ('published', 'draft')),
  display_order integer not null default 0,
  seo_title_en text,
  seo_title_ar text,
  seo_description_en text,
  seo_description_ar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_products_brand on products(brand_id);
create index if not exists idx_products_status on products(status);
create trigger trg_products_updated_at before update on products
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- PRODUCT <-> CATEGORY (many-to-many; usually mirrors the brand's
-- categories but kept independent so a product can be pinned to a
-- specific subset, e.g. AL TAWFEER items split across two categories)
-- ---------------------------------------------------------------------
create table if not exists product_categories (
  product_id uuid not null references products(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  primary key (product_id, category_id)
);

-- ---------------------------------------------------------------------
-- PRODUCT IMAGES (gallery, ordered)
-- ---------------------------------------------------------------------
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  alt_text_en text,
  alt_text_ar text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_product_images_product on product_images(product_id);

-- ---------------------------------------------------------------------
-- PAGES — structured, editable bilingual content blocks
-- (home / about / partnership / contact-intro etc.)
-- content is a JSONB document; shape is defined per-slug in the app.
-- ---------------------------------------------------------------------
create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text,
  title_ar text,
  content jsonb not null default '{}'::jsonb,
  seo_title_en text,
  seo_title_ar text,
  seo_description_en text,
  seo_description_ar text,
  updated_at timestamptz not null default now()
);
create trigger trg_pages_updated_at before update on pages
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- SITE SETTINGS — single row of global, editable configuration
-- ---------------------------------------------------------------------
create table if not exists site_settings (
  id integer primary key default 1 check (id = 1),
  whatsapp_number text not null default '971505023438',
  call_number text not null default '+971505044805',
  email text not null default 'info@goldgravityuae.com',
  working_hours_en text not null default 'Monday–Saturday, 8:00 AM–6:00 PM. Sunday: Closed',
  working_hours_ar text not null default 'الإثنين–السبت، 8:00 صباحًا–6:00 مساءً. الأحد: مغلق',
  address_en text,
  address_ar text,
  google_maps_embed text,
  social_instagram text,
  social_facebook text,
  social_linkedin text,
  social_x text,
  default_seo_title_en text default 'Gold Gravity Trading LLC | Food & Consumer Products Distributor UAE',
  default_seo_title_ar text default 'شركة جولد جرافيتي للتجارة | موزع منتجات غذائية واستهلاكية في الإمارات',
  default_seo_description_en text,
  default_seo_description_ar text,
  ga_measurement_id text,
  logo_url text default '/images/logos/gold-gravity-logo.jpeg',
  updated_at timestamptz not null default now()
);
create trigger trg_settings_updated_at before update on site_settings
  for each row execute function set_updated_at();
insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- QUOTE REQUESTS
-- ---------------------------------------------------------------------
create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company_name text not null,
  contact_person text not null,
  phone text not null,
  email text,
  emirate text not null,
  business_type text,
  category_id uuid references categories(id) on delete set null,
  brand_id uuid references brands(id) on delete set null,
  product_id uuid references products(id) on delete set null,
  quantity text,
  notes text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  locale text default 'en'
);
create index if not exists idx_quote_requests_status on quote_requests(status);

-- ---------------------------------------------------------------------
-- PARTNERSHIP SUBMISSIONS
-- ---------------------------------------------------------------------
create table if not exists partnership_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company_name text not null,
  contact_person text not null,
  country text not null,
  phone text not null,
  email text,
  brand_name text,
  product_category text,
  country_of_origin text,
  company_website text,
  message text,
  catalogue_files jsonb not null default '[]'::jsonb,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  locale text default 'en'
);
create index if not exists idx_partnership_status on partnership_submissions(status);

-- ---------------------------------------------------------------------
-- CONTACT SUBMISSIONS
-- ---------------------------------------------------------------------
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  locale text default 'en'
);
create index if not exists idx_contact_status on contact_submissions(status);

-- ---------------------------------------------------------------------
-- ADMIN PROFILES — links to auth.users, gates /admin access
-- ---------------------------------------------------------------------
create table if not exists admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- STORAGE BUCKETS (idempotent)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('partnership-uploads', 'partnership-uploads', false)
on conflict (id) do nothing;
