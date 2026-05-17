"use client";

import { useRef, useEffect, type ReactNode, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FeedAnimation({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial state for ALL items at once — one operation, not 50
      gsap.set("[data-animate-feed]", { opacity: 0, y: 30 });

      ScrollTrigger.batch("[data-animate-feed]", {
        // كل عناصر الـ viewport الحالي بتتحرك كمجموعة واحدة
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.08,      // ثابت بين عناصر الـ batch — مش متراكم
            overwrite: true,
          }),

        onLeaveBack: (batch) =>
          gsap.to(batch, {
            opacity: 0,
            y: 30,
            duration: 0.3,
            overwrite: true,
          }),

        // كم عنصر يتجمع في batch واحد قبل ما يشتغل
        batchMax: 5,

        // المسافة من أسفل الـ viewport اللي بيبدأ فيها
        start: "top 90%",
      });
    }, containerRef);

    return () => {
      ctx.revert();
      // ScrollTrigger.batch بيعمل instances — لازم تـkill manually
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [])
  // useEffect(() => {
  //   const ctx = gsap.context(() => {
  //     const items = containerRef.current?.querySelectorAll("[data-animate-feed]");
  //     if (!items?.length) return;

  //     items.forEach((item, i) => {
  //       gsap.fromTo(
  //         item,
  //         { opacity: 0, y: 30 },
  //         {
  //           opacity: 1,
  //           y: 0,
  //           duration: 0.5,
  //           delay: i * 0.1,
  //           scrollTrigger: {
  //             trigger: item as HTMLElement,
  //             start: "top 90%",
  //             toggleActions: "play none none reverse",
  //           },
  //         }
  //       );
  //     });
  //   }, containerRef);

  //   return () => ctx.revert();
  // }, []);

  return <div ref={containerRef}>{children}</div>;
}
