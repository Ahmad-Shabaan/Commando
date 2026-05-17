-- Remove the default so simple text answers have NULL content_items
-- Structured answers (with links/locations) will provide their own content_items

ALTER TABLE answers ALTER COLUMN content_items DROP DEFAULT;
