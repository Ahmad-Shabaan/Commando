import { neon } from "@neondatabase/serverless";

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const sql = neon(dbUrl);

  console.log("Removing default from content_items...");
  await sql.query("ALTER TABLE answers ALTER COLUMN content_items DROP DEFAULT");
  console.log("  ✓ Default removed");

  const rows = await sql.query(
    "SELECT column_name, is_nullable, column_default FROM information_schema.columns WHERE table_name='answers' AND column_name='content_items'"
  );
  console.log("  Column info:", JSON.stringify(rows.rows || rows));

  console.log("\nDone.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
