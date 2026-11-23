import type { Session } from "./schemas";

const memoryFallback = new Map<string, string>();

const readStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key) ?? memoryFallback.get(key);
    return saved ? (JSON.parse(saved) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const writeStorage = (key: string, value: unknown) => {
  const json = JSON.stringify(value);
  memoryFallback.set(key, json);
  try {
    localStorage.setItem(key, json);
  } catch {}
};

export type CartLine = { productId: string; qty: number };
export const MAX_QTY = 10;

const clampQty = (qty: number) => Math.min(Math.max(Math.floor(qty), 0), MAX_QTY);

export const getCart = () => readStorage<CartLine[]>("cart", []);

export const cartCount = () => getCart().reduce((total, line) => total + line.qty, 0);

export const setQty = (productId: string, qty: number) => {
  const otherLines = getCart().filter((line) => line.productId !== productId);
  const newQty = clampQty(qty);
  const cart = newQty > 0 ? [...otherLines, { productId, qty: newQty }] : otherLines;
  writeStorage("cart", cart);
};

export const addToCart = (productId: string, qty = 1) => {
  const currentQty = getCart().find((line) => line.productId === productId)?.qty ?? 0;
  setQty(productId, currentQty + qty);
};

export const clearCart = () => writeStorage("cart", []);

export const getSession = () => readStorage<Session | null>("session", null);
export const setSession = (session: Session | null) => writeStorage("session", session);
export const getUser = () => getSession()?.user ?? null;
