import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const sql = neon(dbUrl);

  // Run SQL file
  const migrationPath = path.join(__dirname, "..", "sql", "008_add_content_items_to_answers.sql");
  const migrationSql = fs.readFileSync(migrationPath, "utf-8");

  // Strip SQL comments, then split by semicolons
  const statements = migrationSql
    .replace(/--.*$/gm, "")
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Running migration: ${path.basename(migrationPath)}`);
  console.log(`Found ${statements.length} statement(s) to execute.\n`);

  for (const stmt of statements) {
    const preview = stmt.length > 80 ? stmt.substring(0, 80) + "..." : stmt;
    console.log(`> ${preview}`);
    try {
      await sql.query(stmt);
      console.log("  ✓ OK\n");
    } catch (err: any) {
      console.error(`  ✗ Error: ${err.message}\n`);
    }
  }

  // Verify
  const rows = await sql.query(
    "SELECT id, LEFT(content, 40) as content_preview, content_items FROM answers ORDER BY id LIMIT 5"
  );
  console.log("Verification (first 5 rows):");
  for (const row of rows.rows || rows) {
    const items =
      typeof row.content_items === "string"
        ? JSON.parse(row.content_items)
        : row.content_items;
    console.log(
      `  id=${row.id} | content="${(row.content_preview || "").substring(0, 30)}..." | items=${JSON.stringify(items)}`
    );
  }

  console.log("\nMigration complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
