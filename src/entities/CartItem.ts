import type { Product } from "./Product";

export type CartItem = {
  product: Product;
  qty: number;
};

export type CartSummary = {
  items: CartItem[];
  totalVnd: number;
};
