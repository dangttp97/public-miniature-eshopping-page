import { Field } from "@/components/Field";
import { Layout } from "@/components/Layout";
import { checkEmail, login, register, type Session } from "@/utils/api";
import { readForm } from "@/utils/form";
import { back } from "@/utils/router";
import { emailSchema, loginSchema, registerSchema } from "@/utils/schemas";
import { setSession } from "@/utils/store";

import css from "./Auth.module.css";

type Step = "email" | "login" | "register";

const COPY: Record<Step, { title: string; lead: string; submit: string }> = {
  email: { title: "Đăng nhập hoặc tạo tài khoản", lead: "Nhập email để tiếp tục.", submit: "Tiếp tục" },
  login: { title: "Chào mừng trở lại", lead: "Nhập mật khẩu để đăng nhập.", submit: "Đăng nhập" },
  register: { title: "Tạo tài khoản", lead: "Chỉ cần tên và mật khẩu, không cần xác minh.", submit: "Tạo tài khoản" },
};

const ui = (form: HTMLFormElement) => ({
  section: form.closest("section")!,
  button: form.querySelector<HTMLButtonElement>("button[type=submit]")!,
  alert: form.querySelector<HTMLElement>("[role=alert]")!,
  email: form.querySelector<HTMLInputElement>("[name=email]")!,
  password: form.querySelector<HTMLInputElement>("[name=password]")!,
});

const setStep = (form: HTMLFormElement, step: Step) => {
  const { section, button, alert, email, password } = ui(form);
  form.dataset.step = step;
  form.querySelectorAll<HTMLFieldSetElement>("fieldset[data-steps]").forEach((group) => {
    const on = group.dataset.steps!.split(" ").includes(step);
    group.hidden = !on;
    group.disabled = !on;
  });
  section.querySelector("h1")!.textContent = COPY[step].title;
  section.querySelector("[data-lead]")!.textContent = COPY[step].lead;
  button.textContent = COPY[step].submit;
  alert.textContent = "";
  email.readOnly = step !== "email";
  password.autocomplete = step === "register" ? "new-password" : "current-password";
  form.querySelectorAll("[data-error-for]").forEach((el) => (el.textContent = ""));
  form.querySelector<HTMLInputElement>(step === "email" ? "[name=email]" : step === "login" ? "[name=password]" : "[name=name]")!.focus();
};

const run = async (form: HTMLFormElement, task: () => Promise<void>) => {
  const { button, alert } = ui(form);
  const label = button.textContent;
  button.disabled = true;
  button.textContent = "Đang xử lý…";
  try {
    await task();
  } catch (err) {
    alert.textContent = (err as Error).message;
  } finally {
    button.disabled = false;
    if (button.textContent === "Đang xử lý…") button.textContent = label;
  }
};

const onSubmit = (e: SubmitEvent) => {
  e.preventDefault();
  const form = e.currentTarget as HTMLFormElement;
  ui(form).alert.textContent = "";
  const step = form.dataset.step as Step;

  if (step === "email") {
    const data = readForm(form, emailSchema);
    if (data) run(form, async () => setStep(form, (await checkEmail(data.email)) ? "login" : "register"));
    return;
  }
  const signIn = (pending: Promise<Session>) =>
    run(form, async () => {
      setSession(await pending);
      back();
    });

  if (step === "login") {
    const data = readForm(form, loginSchema);
    if (data) signIn(login(data.email, data.password));
  } else {
    const data = readForm(form, registerSchema);
    if (data) signIn(register(data.name, data.email, data.password));
  }
};

export const Auth = () => (
  <Layout>
    <section className={`card ${css.wrap}`}>
      <div className={css.head}>
        <h1>{COPY.email.title}</h1>
        <p className="muted" data-lead>
          {COPY.email.lead}
        </p>
      </div>

      <form className={css.form} data-step="email" onSubmit={onSubmit} novalidate>
        <Field label="Email" name="email" type="email" autocomplete="email" required />

        <fieldset className={css.group} data-steps="login register" hidden disabled>
          <button type="button" className={css.change} onClick={(e: MouseEvent) => setStep((e.currentTarget as Element).closest("form")!, "email")}>
            Dùng email khác
          </button>
        </fieldset>

        <fieldset className={css.group} data-steps="register" hidden disabled>
          <p className={css.notice}>Email này chưa có tài khoản. Điền thêm tên để tạo tài khoản mới.</p>
          <Field label="Họ và tên" name="name" autocomplete="name" required />
        </fieldset>

        <fieldset className={css.group} data-steps="login register" hidden disabled>
          <Field label="Mật khẩu" name="password" type="password" autocomplete="current-password" hint="Tạo tài khoản mới: tối thiểu 6 ký tự" required />
        </fieldset>

        <p className="alert" role="alert"></p>
        <button type="submit" className="btn btn-primary btn-block">
          {COPY.email.submit}
        </button>
      </form>

      <p className={`muted ${css.foot}`}>Tài khoản thử: an@example.vn / matkhau123 hoặc binh@example.vn / 123456.</p>
    </section>
  </Layout>
);
