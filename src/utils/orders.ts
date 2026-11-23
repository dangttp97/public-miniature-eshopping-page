import { getProducts, type Order } from "./api";

export const PAYMENT_LABEL = { cod: "Thanh toán khi nhận hàng", bank_transfer: "Chuyển khoản ngân hàng" };
export const STATUS_LABEL: Record<string, string> = { pending: "Chờ xác nhận" };

export const withLines = async (order: Order) => {
  const products = await getProducts();
  const lines = order.items.map((i) => ({
    ...i,
    name: products.find((p) => p.id === i.productId)?.name ?? i.productId,
  }));
  return { ...order, lines, totalVnd: lines.reduce((sum, l) => sum + l.priceVnd * l.qty, 0) };
};

export const orderDate = (iso: string) =>
  new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
