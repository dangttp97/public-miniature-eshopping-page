import { cx } from "@/lib/cx";
import type { Child } from "@koniwa/core";

import css from "./Button.module.css";

type ButtonVariant = "primary" | "outline" | "ghost";

export type ButtonStyle = {
  variant?: ButtonVariant;
  block?: boolean;
  iconOnly?: boolean;
};

type ButtonProps = ButtonStyle & {
  type?: "button" | "submit" | "reset";
  className?: string;
  children?: Child;
  [attribute: string]: unknown;
};

export const buttonClass = ({ variant = "primary", block = false, iconOnly = false }: ButtonStyle = {}, className?: string) =>
  cx(css.button, css[variant], block && css.block, iconOnly && css.iconOnly, className);

export const Button = ({ variant, block, iconOnly, className, children, ...attributes }: ButtonProps) => (
  <button {...attributes} className={buttonClass({ variant, block, iconOnly }, className)}>
    {children}
  </button>
);
