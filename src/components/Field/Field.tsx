import { cx } from "@/lib/cx";
import type { ComponentPropsWithoutRef } from "@koniwa/core";

import css from "./Field.module.css";

export const inputClass = css.input;
export const hintClass = css.hint;

type FieldProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
  name: string;
  hint?: string;
  multiline?: boolean;
};

export const Field = ({
  label,
  name,
  hint,
  multiline,
  className,
  required,
  ...attributes
}: FieldProps) => {
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;
  const control: Record<string, unknown> = {
    ...attributes,
    id: name,
    name,
    className: css.input,
    "aria-describedby": cx(hint && hintId, errorId),
  };

  return (
    <div className={cx(css.field, className)}>
      <label className={css.label} htmlFor={name}>
        {label}
        {required ? <p className={css.requiredMark}>*</p> : ""}
      </label>
      {multiline ? <textarea {...control} /> : <input {...control} />}
      {hint && (
        <span id={hintId} className={css.hint}>
          {hint}
        </span>
      )}
      <span
        id={errorId}
        className={css.error}
        data-error-for={name}
        aria-live="polite"
      />
    </div>
  );
};
