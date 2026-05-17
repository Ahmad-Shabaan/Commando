import { neon } from "@neondatabase/serverless";
import { generateSlug } from "../lib/slug";

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log("Fetching questions without slugs...");
  const questions = await sql`
    SELECT id, title FROM questions WHERE slug IS NULL ORDER BY id
  `;

  if (questions.length === 0) {
    console.log("All questions already have slugs. Nothing to do.");
    process.exit(0);
  }

  console.log(`Found ${questions.length} questions without slugs.`);

  for (const q of questions) {
    let slug = generateSlug(q.title);

    if (!slug) {
      slug = `question-${q.id}`;
    }

    // Ensure uniqueness
    let finalSlug = slug;
    let counter = 1;
    while (true) {
      const existing = await sql`
        SELECT id FROM questions WHERE slug = ${finalSlug} AND id != ${q.id}
      `;
      if (existing.length === 0) break;
      counter++;
      finalSlug = `${slug}-${counter}`;
    }

    await sql`
      UPDATE questions SET slug = ${finalSlug} WHERE id = ${q.id}
    `;
    console.log(`  ✓ [${q.id}] ${q.title.substring(0, 40)}... → ${finalSlug}`);
  }

  console.log("\nDone! All questions seeded with slugs.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to seed slugs:", err);
  process.exit(1);
});
