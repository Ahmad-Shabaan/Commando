import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddQuestionForm from "@/components/AddQuestionForm";

const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AddQuestionForm", () => {
  it("renders the form with input and submit button", () => {
    render(<AddQuestionForm />);

    expect(screen.getByLabelText("عنوان السؤال")).toBeDefined();
    expect(screen.getByText("نشر السؤال")).toBeDefined();
  });

  it("shows validation error on empty submission", async () => {
    const user = userEvent.setup();
    render(<AddQuestionForm />);

    await user.click(screen.getByText("نشر السؤال"));

    expect(screen.getByText("يرجى كتابة سؤال قبل الإرسال")).toBeDefined();
  });

  it("submits a question and sends correct POST request", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, title: "", created_at: "2026-01-01T00:00:00Z" }),
    } as Response);

    render(<AddQuestionForm />);

    const input = screen.getByLabelText("عنوان السؤال") as HTMLInputElement;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, "value"
    )!.set!;
    nativeInputValueSetter.call(input, "test question");
    input.dispatchEvent(new Event("input", { bubbles: true }));

    await userEvent.click(screen.getByText("نشر السؤال"));

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/questions",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("test question"),
        })
      );
    }, { timeout: 5000 });
  });

  it("shows error message when API returns failure", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "حدث خطأ أثناء الإرسال" }),
    } as Response);

    render(<AddQuestionForm />);

    const input = screen.getByLabelText("عنوان السؤال") as HTMLInputElement;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, "value"
    )!.set!;
    nativeInputValueSetter.call(input, "any question");
    input.dispatchEvent(new Event("input", { bubbles: true }));

    await userEvent.click(screen.getByText("نشر السؤال"));

    expect(await screen.findByText("حدث خطأ أثناء الإرسال")).toBeDefined();
  });

  it("disables submit button while submitting", async () => {
    vi.mocked(fetch).mockImplementationOnce(
      () => new Promise(() => {})
    );

    render(<AddQuestionForm />);

    const input = screen.getByLabelText("عنوان السؤال") as HTMLInputElement;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, "value"
    )!.set!;
    nativeInputValueSetter.call(input, "any question");
    input.dispatchEvent(new Event("input", { bubbles: true }));

    await userEvent.click(screen.getByText("نشر السؤال"));

    expect(screen.getByText("جاري الإرسال...")).toBeDefined();
  });
});
