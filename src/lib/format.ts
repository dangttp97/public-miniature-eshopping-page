const vndFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

export const formatVnd = (amount: number) => vndFormatter.format(amount);

export const discountPercent = (price: number, originalPrice: number) => {
  if (originalPrice <= price) return 0;
  return Math.round((1 - price / originalPrice) * 100);
};
