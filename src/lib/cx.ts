type ClassValue = string | number | false | null | undefined;

export const cx = (...classes: ClassValue[]) => classes.filter(Boolean).join(" ");
