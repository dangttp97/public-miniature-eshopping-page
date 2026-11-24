import { Button } from "@/components/Button/Button";
import { cx } from "@/lib/cx";
import type { Child } from "@koniwa/core";

import css from "./AuthForm.module.css";

type AuthFormProps = {
  title: string;
  lead: string;
  submitLabel: string;
  isBusy: boolean;
  error: string;
  onSubmit: (e: SubmitEvent) => void;
  footer: Child;
  children?: Child;
};

export const AuthForm = ({
  title,
  lead,
  submitLabel,
  isBusy,
  error,
  onSubmit,
  footer,
  children,
}: AuthFormProps) => (
  <section className={cx("card", css.wrap)}>
    <div className={css.head}>
      <h1>{title}</h1>
      <p className="muted">{lead}</p>
    </div>

    <form className={css.form} onSubmit={onSubmit} novalidate>
      {children}
      <p className="alert" role="alert">
        {error}
      </p>
      <Button type="submit" block disabled={isBusy}>
        {isBusy ? "Đang xử lý…" : submitLabel}
      </Button>
    </form>

    <div className={cx("muted", css.foot)}>{footer}</div>
  </section>
);
