import type { PaymentMethod } from "@/entities/Order";

export const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; hint: string }[] = [
  {
    value: "cod",
    label: "Thanh toán khi nhận hàng (COD)",
    hint: "Trả tiền mặt cho nhân viên giao hàng.",
  },
  {
    value: "bank_transfer",
    label: "Chuyển khoản ngân hàng",
    hint: "Thông tin tài khoản hiển thị sau khi đặt hàng.",
  },
];

export const PAYMENT_LABEL = Object.fromEntries(
  PAYMENT_OPTIONS.map((option) => [option.value, option.label]),
) as Record<PaymentMethod, string>;
