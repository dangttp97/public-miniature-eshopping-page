import { hintClass } from "@/components/Field/Field";
import { cx } from "@/lib/cx";

import css from "./Radio.module.css";

type RadioProps = {
  label: string;
  hint?: string;
  name: string;
  value: string;
  checked?: boolean;
  className?: string;
  [attribute: string]: unknown;
};

export const Radio = ({
  label,
  hint,
  className,
  ...attributes
}: RadioProps) => (
  <label className={cx(css.option, className)}>
    <input {...attributes} type="radio" className={css.input} />
    <span className={css.text}>
      <strong className={css.label}>{label}</strong>
      {hint && <span className={hintClass}>{hint}</span>}
    </span>
  </label>
);
