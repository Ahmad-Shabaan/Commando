import Hero from "@/components/Hero";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import ClientHome from "@/components/ClientHome";

export default async function Home() {
  return (
    <>
      <Hero />
      <AnnouncementBanner />
      <ClientHome />
    </>
  );
}
