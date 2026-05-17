import Hero from "@/components/Hero";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import ClientHome from "@/components/ClientHome";
import sql from "@/lib/db";
import type { Question } from "@/lib/types";

export default async function Home() {
  const initialQuestions = await sql`
    SELECT id, title, created_at, slug 
    FROM questions 
    ORDER BY created_at ASC
  `;

  return (
    <>
      <Hero />
      <AnnouncementBanner />
      <main>
        <ClientHome initialQuestions={initialQuestions as Question[]} />
      </main>
    </>
  );
}
