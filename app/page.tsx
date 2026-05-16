import Hero from "@/components/Hero";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import ClientHome from "@/components/ClientHome";
import FaqJsonLd from "@/components/FaqJsonLd";

export default async function Home() {
  return (
    <>
      <FaqJsonLd />
      <Hero />
      <AnnouncementBanner />
      <main>
        <ClientHome />
      </main>
    </>
  );
}
