-- Seed slugs for existing questions that don't have one yet
-- This uses a PL/pgSQL block to generate unique slugs from question titles

DO $$
DECLARE
  q RECORD;
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER;
BEGIN
  FOR q IN SELECT id, title FROM questions WHERE slug IS NULL ORDER BY id LOOP
    -- Generate base transliterated slug from title
    base_slug := lower(
      regexp_replace(
        regexp_replace(
          translate(lower(q.title),
            'اأإآبتثجحخدذرزسشصضطظعغفقكلمنهوىةئؤ',
            'aaaaaabtthjhhddzrzzssssssttzzaghfqkkllmnhhwaaeo'
          ),
          '[^a-z0-9\s-]', '', 'g'
        ),
        '\s+', '-', 'g'
      )
    );
    base_slug := substring(base_slug, 1, 60);
    base_slug := regexp_replace(base_slug, '-+', '-', 'g');
    base_slug := trim(both '-' from base_slug);

    -- Ensure uniqueness: append -2, -3, etc. if slug already exists
    final_slug := base_slug;
    counter := 1;
    WHILE EXISTS (SELECT 1 FROM questions WHERE slug = final_slug AND id != q.id) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;

    UPDATE questions SET slug = final_slug WHERE id = q.id;
  END LOOP;
END $$;
