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
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const ctx = gsap.context(() => {
      input.addEventListener("focus", () => {
        gsap.to(input, {
          scaleX: 1.02,
          duration: 0.3,
          ease: "power2.out",
          transformOrigin: "right center",
        });
      });
      input.addEventListener("blur", () => {
        gsap.to(input, {
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
      setSuccess(true);
      router.refresh();
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-gradient-to-b from-surface-container-lowest to-surface-container-low border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
      <h2 className="text-headline-sm md:text-headline-md text-primary mb-6 flex items-center gap-2 font-bold">
        <MessageSquarePlus className="size-5 sm:size-6" />
        إضافة سؤال
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div>
          <label
            className="block text-label-md text-on-surface mb-2 font-bold"
            htmlFor="question_title"
          >
            عنوان السؤال
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              id="question_title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
              className="w-full
                        bg-surface
                        border-2 border-outline-variant/50
                        focus:border-primary
                        focus:ring-0
                        focus:outline-none
                        focus:shadow-none
                        text-on-surface text-body-md
                        px-4 py-3
                        rounded-xl
                        transition-colors"
            />
          </div>
          {error && (
            <p className="text-error text-sm mt-2 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
              <span className="w-1.5 h-1.5 rounded-full bg-error inline-block" />
              {error}
            </p>
          )}
          {success && (
            <p className="text-primary text-sm mt-2 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              تم تسجيل سؤالك، وسيتم الإجابة عليه قريباً.
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-on-primary text-label-md font-bold py-3.5 px-6 rounded-xl cursor-pointer hover:bg-primary/90 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed"
        >
          {submitting ? "جاري الإرسال..." : <span className="flex items-center gap-2 justify-center">
            <SendHorizontal className="size-5" />
            نشر السؤال
          </span>}
        </button>
      </form>
    </div>
  );
}
