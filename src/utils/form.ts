import type { z } from "zod";

export const readForm = <S extends z.ZodType>(form: HTMLFormElement, schema: S): z.output<S> | null => {
  form.querySelectorAll("[data-error-for]").forEach((el) => (el.textContent = ""));
  form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));

  const result = schema.safeParse(Object.fromEntries(new FormData(form)));
  if (result.success) return result.data;

  for (const issue of result.error.issues) {
    const name = String(issue.path[0]);
    const slot = form.querySelector(`[data-error-for="${name}"]`);
    if (slot && !slot.textContent) slot.textContent = issue.message;
    form.querySelector(`[name="${name}"]`)?.setAttribute("aria-invalid", "true");
  }
  form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
  return null;
};
