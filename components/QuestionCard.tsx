"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface Question {
  id: number;
  title: string;
}

export default function QuestionCard({ question }: { question: Question }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      el.addEventListener("mouseenter", () => {
        gsap.to(el, { x: 2, duration: 0.2, ease: "power1.out" });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, duration: 0.2, ease: "power1.out" });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return <span className=" text-base md:text-lg" ref={ref}>{question.title}</span>;
}
