import { getProducts, type Order } from "./api";

export const PAYMENT_LABEL = { cod: "Thanh toán khi nhận hàng", bank_transfer: "Chuyển khoản ngân hàng" };
export const STATUS_LABEL: Record<string, string> = { pending: "Chờ xác nhận" };

export const withProductNames = async (order: Order) => {
  const products = await getProducts();
  const productName = (productId: string) => products.find((p) => p.id === productId)?.name ?? productId;

  const lines = order.items.map((item) => ({ ...item, name: productName(item.productId) }));
  const totalVnd = lines.reduce((total, line) => total + line.priceVnd * line.qty, 0);
  return { ...order, lines, totalVnd };
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" });

export const formatOrderDate = (isoDate: string) => dateFormatter.format(new Date(isoDate));
