-- Add content_items JSONB column for structured answer content
-- Each item in the array has: { type: "text"|"link"|"location", text?, href?, label? }

ALTER TABLE answers ADD COLUMN IF NOT EXISTS content_items JSONB;

-- Migrate existing plain-text content to the structured format
-- Wraps each existing text value into [{ type: "text", text: "<content>" }]
UPDATE answers
SET content_items = jsonb_build_array(
  jsonb_build_object('type', 'text', 'text', content)
)
WHERE content IS NOT NULL
  AND content != ''
  AND (content_items IS NULL OR content_items = '[]'::jsonb);

-- Set a sensible default so new rows that omit content_items get an empty array
ALTER TABLE answers ALTER COLUMN content_items SET DEFAULT '[]'::jsonb;
