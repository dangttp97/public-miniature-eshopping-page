import { getProducts } from "@/api/products";
import type { CartItem } from "@/entities/CartItem";
import { useAsync } from "@/lib/useAsync";

import { useCart } from "./cartStore";

export const useCartItems = () => {
  const cart = useCart();
  const products = useAsync(getProducts, []);
  if (products.status !== "done") return products;

  const items: CartItem[] = cart.flatMap(({ productId, qty }) => {
    const product = products.data.find((p) => p.id === productId);
    return product ? [{ product, qty }] : [];
  });
  const totalVnd = items.reduce(
    (sum, item) => sum + item.product.priceVnd * item.qty,
    0,
  );
  return { ...products, data: { items, totalVnd } };
};
