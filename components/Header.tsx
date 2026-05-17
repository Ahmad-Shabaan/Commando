import Image from "next/image";

export default function Header() {
  return (
    <header className="absolute top-0 z-10 w-full flex justify-end">
      <Image
        src="/commando.png"
        alt="Commando"
        width={120}
        height={60}
        className="w-auto"
        priority
      />
    </header>
  );
}
