import { z } from "zod";

export const questionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(500, "Title must be at most 500 characters")
    .regex(/^[\u0600-\u06FFa-zA-Z0-9\s؟.,!?-]+$/, "Title contains invalid characters")
    .refine((val) => !/<script|<\/script>/gi.test(val), {
      message: "Invalid content",
    }),
});

export const answerSchema = z.object({
  questionId: z.number().int().positive("questionId must be a positive integer"),
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(2000, "Content must be at most 2000 characters"),
});

export type QuestionInput = z.infer<typeof questionSchema>;
export type AnswerInput = z.infer<typeof answerSchema>;
