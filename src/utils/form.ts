import type { z } from "zod";

const clearErrors = (form: HTMLFormElement) => {
  form.querySelectorAll("[data-error-for]").forEach((slot) => (slot.textContent = ""));
  form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
};

const showErrors = (form: HTMLFormElement, issues: z.core.$ZodIssue[]) => {
  for (const issue of issues) {
    const fieldName = String(issue.path[0]);
    const errorSlot = form.querySelector(`[data-error-for="${fieldName}"]`);
    const isFirstErrorForField = errorSlot && !errorSlot.textContent;
    if (isFirstErrorForField) errorSlot.textContent = issue.message;
    form.querySelector(`[name="${fieldName}"]`)?.setAttribute("aria-invalid", "true");
  }
  form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
};

export const validateForm = <S extends z.ZodType>(form: HTMLFormElement, schema: S): z.output<S> | null => {
  clearErrors(form);
  const values = Object.fromEntries(new FormData(form));
  const result = schema.safeParse(values);
  if (result.success) return result.data;

  showErrors(form, result.error.issues);
  return null;
};
