type FieldProps = {
  label: string;
  name: string;
  hint?: string;
  multiline?: boolean;
  [attr: string]: unknown;
};

export const Field = ({ label, name, hint, multiline, ...attrs }: FieldProps) => {
  const control = {
    id: name,
    name,
    className: "input",
    "aria-describedby": [hint && `${name}-hint`, `${name}-error`].filter(Boolean).join(" "),
    ...attrs,
  };
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {multiline ? <textarea {...control} /> : <input {...control} />}
      {hint && (
        <span id={`${name}-hint`} className="hint">
          {hint}
        </span>
      )}
      <span id={`${name}-error`} className="field-error" data-error-for={name} aria-live="polite" />
    </div>
  );
};
