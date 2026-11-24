import type { CartLine } from "@/entities/CartLine";
import { readStorage, subscribe, writeStorage } from "@/lib/storage";
import { useSyncExternalStore } from "@koniwa/core";

export const MAX_QTY = 10;

const clampQty = (qty: number) =>
  Math.min(Math.max(Math.floor(qty), 0), MAX_QTY);

export const getCart = () => readStorage<CartLine[]>("cart", []);

export const setQty = (productId: string, qty: number) => {
  const otherLines = getCart().filter((line) => line.productId !== productId);
  const newQty = clampQty(qty);
  const cart =
    newQty > 0 ? [...otherLines, { productId, qty: newQty }] : otherLines;
  writeStorage("cart", cart);
};

export const addToCart = (productId: string, qty = 1) => {
  const currentQty =
    getCart().find((line) => line.productId === productId)?.qty ?? 0;
  setQty(productId, currentQty + qty);
};

export const clearCart = () => writeStorage("cart", []);

export const useCart = () => useSyncExternalStore(subscribe, getCart);
