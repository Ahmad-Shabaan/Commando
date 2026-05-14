"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { findDuplicate } from "@/lib/duplicate-detection";
import { getQuestions } from "@/lib/question-store";
import { SendHorizontal, MessageSquarePlus } from 'lucide-react';

export default function AddQuestionForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const ctx = gsap.context(() => {
      input.addEventListener("focus", () => {
        gsap.to(input, {
          borderBottomColor: "var(--color-primary)",
          scaleX: 1.02,
          duration: 0.3,
          ease: "power2.out",
          transformOrigin: "right center",
        });
      });
      input.addEventListener("blur", () => {
        gsap.to(input, {
          borderBottomColor: "var(--color-secondary)",
          scaleX: 1,
          duration: 0.3,
          ease: "power2.out",
          transformOrigin: "right center",
        });
      });
    }, input);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (error !== "") {
      const timeoutId = setTimeout(() => {
        setError("");
        setTitle("");
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) {
      setError("يرجى كتابة سؤال قبل الإرسال");
      return;
    }

    const questions = getQuestions();
    const duplicate = findDuplicate(title.trim(), questions);

    if (duplicate) {
      setError("سؤالك موجود بالفعل، إليك الإجابة المتاحة");
      window.dispatchEvent(
        new CustomEvent("scroll-to-question", { detail: { questionId: duplicate.id } })
      );
      console.log("test dispatch event", duplicate.id);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (res.status === 429) {
        setError("لقد وصلت للحد اليومي (5 أسئلة في اليوم)");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "حدث خطأ أثناء الإرسال");
        return;
      }

      setTitle("");
      router.refresh();
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 md:p-8">
      <h3 className="text-headline-md text-primary mb-6 flex items-center gap-2">
        <MessageSquarePlus className="size-4 sm:size-5" />
        إضافة سؤال
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            className="block text-label-md text-on-surface mb-2"
            htmlFor="question_title"
          >
            عنوان السؤال
          </label>
          <input
            ref={inputRef}
            id="question_title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="اكتب سؤالك هنا..."
            className="w-full bg-surface-container-low border-0 border-b-2 border-secondary focus:ring-0 focus:border-primary text-on-surface text-body-md px-4 py-3 rounded-t-lg transition-colors outline-none"
          />
          {error && (
            <p className="text-error text-caption mt-2">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-on-primary text-label-md py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {submitting ? "جاري الإرسال..." : <span className="flex items-center gap-2 justify-center">
            <SendHorizontal className="size-4 sm:size-5" />
            نشر السؤال
          </span>}
        </button>
      </form>
    </div>
  );
}
