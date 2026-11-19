
-- RADAR 2.0
-- Migration 001: produtos e anúncios
-- Não depende do esquema da versão antiga.

BEGIN;

-- 1. Produtos monitorados por usuário.

CREATE TABLE public.monitored_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  color TEXT,

  condition TEXT NOT NULL DEFAULT 'new',

  target_price NUMERIC(12,2),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT product_name_length
    CHECK (length(trim(name)) BETWEEN 3 AND 120),

  CONSTRAINT product_brand_length
    CHECK (length(trim(brand)) BETWEEN 2 AND 60),

  CONSTRAINT product_model_length
    CHECK (length(trim(model)) BETWEEN 2 AND 120),

  CONSTRAINT product_variant_length
    CHECK (
      variant IS NULL
      OR length(trim(variant)) BETWEEN 1 AND 100
    ),

  CONSTRAINT product_color_length
    CHECK (
      color IS NULL
      OR length(trim(color)) BETWEEN 1 AND 60
    ),

  CONSTRAINT product_condition_new
    CHECK (condition = 'new'),

  CONSTRAINT product_target_price_positive
    CHECK (
      target_price IS NULL
      OR target_price > 0
    ),

  CONSTRAINT product_owner_unique
    UNIQUE (id, user_id)
);

CREATE INDEX monitored_products_user_idx
ON public.monitored_products(user_id, created_at DESC);


-- 2. Anúncios específicos cadastrados.

CREATE TABLE public.product_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES auth.users(id) ON DELETE CASCADE,

  product_id UUID NOT NULL,

  store_id TEXT NOT NULL
    CHECK (
      store_id IN (
        'amazon',
        'mercadolivre',
        'magalu'
      )
    ),

  listing_url TEXT NOT NULL,
  external_id TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT listing_url_length
    CHECK (length(listing_url) BETWEEN 12 AND 2000),

  CONSTRAINT listing_product_owner_fk
    FOREIGN KEY (product_id, user_id)
    REFERENCES public.monitored_products(id, user_id)
    ON DELETE CASCADE,

  CONSTRAINT listing_unique_per_user
    UNIQUE (user_id, listing_url)
);

CREATE INDEX product_listings_product_idx
ON public.product_listings(product_id, user_id);


-- 3. Segurança: Row Level Security.

ALTER TABLE public.monitored_products
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.product_listings
ENABLE ROW LEVEL SECURITY;


-- 4. Políticas para produtos.

CREATE POLICY "products_select_own"
ON public.monitored_products
FOR SELECT TO authenticated
USING (
  (SELECT auth.uid()) = user_id
);

CREATE POLICY "products_insert_own"
ON public.monitored_products
FOR INSERT TO authenticated
WITH CHECK (
  (SELECT auth.uid()) = user_id
);

CREATE POLICY "products_update_own"
ON public.monitored_products
FOR UPDATE TO authenticated
USING (
  (SELECT auth.uid()) = user_id
)
WITH CHECK (
  (SELECT auth.uid()) = user_id
);

CREATE POLICY "products_delete_own"
ON public.monitored_products
FOR DELETE TO authenticated
USING (
  (SELECT auth.uid()) = user_id
);


-- 5. Políticas para anúncios.

CREATE POLICY "listings_select_own"
ON public.product_listings
FOR SELECT TO authenticated
USING (
  (SELECT auth.uid()) = user_id
);

CREATE POLICY "listings_insert_own"
ON public.product_listings
FOR INSERT TO authenticated
WITH CHECK (
  (SELECT auth.uid()) = user_id
);

CREATE POLICY "listings_update_own"
ON public.product_listings
FOR UPDATE TO authenticated
USING (
  (SELECT auth.uid()) = user_id
)
WITH CHECK (
  (SELECT auth.uid()) = user_id
);

CREATE POLICY "listings_delete_own"
ON public.product_listings
FOR DELETE TO authenticated
USING (
  (SELECT auth.uid()) = user_id
);

COMMIT;
