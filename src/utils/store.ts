import type { Session } from "./schemas";

const memory = new Map<string, string>();
const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key) ?? memory.get(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown) => {
  const raw = JSON.stringify(value);
  memory.set(key, raw);
  try {
    localStorage.setItem(key, raw);
  } catch {}
};

export type CartLine = { productId: string; qty: number };
export const MAX_QTY = 10;

export const getCart = () => read<CartLine[]>("cart", []);
export const cartCount = () => getCart().reduce((sum, l) => sum + l.qty, 0);

export const setQty = (productId: string, qty: number) => {
  const others = getCart().filter((l) => l.productId !== productId);
  const clamped = Math.min(Math.max(Math.floor(qty), 0), MAX_QTY);
  write("cart", clamped ? [...others, { productId, qty: clamped }] : others);
};
export const addToCart = (productId: string, qty = 1) =>
  setQty(productId, (getCart().find((l) => l.productId === productId)?.qty ?? 0) + qty);
export const clearCart = () => write("cart", []);

export const getSession = () => read<Session | null>("session", null);
export const setSession = (session: Session | null) => write("session", session);
export const getUser = () => getSession()?.user ?? null;
