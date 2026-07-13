-- =============================================================================
-- DATA MIGRATION: news + settings (old schema) → category, post, breaking_news
-- =============================================================================
-- This migration is intentionally idempotent and safe to run on both:
--   • An existing database that still has the old `news` / `settings` tables
--     → renames them to *_old, then migrates all usable data.
--   • A fresh / already-migrated database with no old tables
--     → detects their absence and exits cleanly without touching anything.
-- =============================================================================

DO $$
BEGIN

  -- -------------------------------------------------------------------------
  -- Bail out early if the old tables are already gone (fresh DB or re-run).
  -- -------------------------------------------------------------------------
  IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'news'
  ) THEN
    RAISE NOTICE 'Old "news" table not found - skipping data migration.';
    RETURN;
  END IF;

  -- -------------------------------------------------------------------------
  -- STEP 1 – Rename old tables so their data is preserved
  -- -------------------------------------------------------------------------

  ALTER TABLE news     RENAME TO news_old;
  ALTER TABLE settings RENAME TO settings_old;

  ALTER INDEX IF EXISTS idx_news_created_at RENAME TO idx_news_old_created_at;
  ALTER INDEX IF EXISTS idx_news_category   RENAME TO idx_news_old_category;
  ALTER INDEX IF EXISTS idx_news_trending   RENAME TO idx_news_old_trending;

  RAISE NOTICE 'Step 1 complete: old tables renamed.';

  -- -------------------------------------------------------------------------
  -- STEP 2 – Migrate categories
  --   source : distinct (category, cat_color) from news_old
  --   target : category
  -- -------------------------------------------------------------------------

  INSERT INTO category (id, name, slug, color)
  SELECT
      gen_random_uuid()::text                                            AS id,
      cat.name                                                           AS name,
      regexp_replace(
          regexp_replace(lower(trim(cat.name)), '[^a-z0-9]+', '-', 'g'),
          '(^-|-$)', '', 'g'
      )                                                                  AS slug,
      COALESCE(MAX(cat.cat_color), 'bg-blue-100 text-blue-700')         AS color
  FROM (
      SELECT DISTINCT category AS name, cat_color
      FROM   news_old
      WHERE  category IS NOT NULL AND trim(category) <> ''
  ) cat
  GROUP BY cat.name
  ON CONFLICT (name) DO NOTHING;

  RAISE NOTICE 'Step 2 complete: categories migrated.';

  -- -------------------------------------------------------------------------
  -- STEP 3 – Migrate news_old → post
  -- -------------------------------------------------------------------------

  INSERT INTO post (
      id, title, slug, summary, "fullContent", image,
      trending, "isHighlight", published, views,
      "createdAt", "updatedAt", "categoryId"
  )
  SELECT
      gen_random_uuid()::text                                              AS id,
      n.title                                                              AS title,
      regexp_replace(
          regexp_replace(lower(trim(n.title)), '[^a-z0-9]+', '-', 'g'),
          '(^-|-$)', '', 'g'
      ) || '-' || n.id::text                                               AS slug,
      COALESCE(n.summary,      '')                                         AS summary,
      COALESCE(n.full_content, '')                                         AS "fullContent",
      n.image                                                              AS image,
      COALESCE(n.trending,     false)                                      AS trending,
      false                                                                AS "isHighlight",
      true                                                                 AS published,
      0                                                                    AS views,
      COALESCE(n.created_at,   NOW())                                      AS "createdAt",
      NOW()                                                                AS "updatedAt",
      c.id                                                                 AS "categoryId"
  FROM news_old n
  JOIN category c ON c.name = n.category
  WHERE n.category IS NOT NULL AND trim(n.category) <> '';

  RAISE NOTICE 'Step 3 complete: posts migrated.';

  -- -------------------------------------------------------------------------
  -- STEP 4 – Migrate settings_old.breaking_text → breaking_news
  -- -------------------------------------------------------------------------

  INSERT INTO breaking_news (
      id, text, "labelLink", "postId", "isActive", "createdAt", "updatedAt"
  )
  SELECT
      gen_random_uuid()::text AS id,
      s.breaking_text         AS text,
      NULL                    AS "labelLink",
      NULL                    AS "postId",
      true                    AS "isActive",
      NOW()                   AS "createdAt",
      NOW()                   AS "updatedAt"
  FROM settings_old s
  WHERE s.breaking_text IS NOT NULL AND trim(s.breaking_text) <> '';

  RAISE NOTICE 'Step 4 complete: breaking news migrated.';

  -- -------------------------------------------------------------------------
  -- STEP 5 – Verification summary
  -- -------------------------------------------------------------------------

  RAISE NOTICE 'Migration summary: % categories, % posts, % breaking_news rows.',
      (SELECT COUNT(*) FROM category),
      (SELECT COUNT(*) FROM post),
      (SELECT COUNT(*) FROM breaking_news);

  RAISE NOTICE 'Data migration complete. Old tables preserved as news_old and settings_old.';
  RAISE NOTICE 'Manual follow-up: create user accounts, link authors to posts via _PostAuthors, then DROP TABLE news_old, settings_old.';

END;
$$;
