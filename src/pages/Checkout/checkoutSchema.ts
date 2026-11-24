import { PAYMENT_METHODS } from "@/entities/Order";
import { z } from "zod";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Email chưa đúng định dạng"));
const required = (label: string) =>
  z.string().trim().min(1, `Vui lòng nhập ${label}`);

export const checkoutSchema = z.object({
  name: required("họ và tên"),
  phone: z
    .string()
    .trim()
    .regex(/^0\d{9}$/, "Số điện thoại gồm 10 số, bắt đầu bằng 0"),
  email: z.union([z.literal(""), email]).transform((v) => v || undefined),
  address: required("địa chỉ giao hàng").min(
    10,
    "Địa chỉ quá ngắn, thêm phường/quận/tỉnh",
  ),
  note: z
    .string()
    .trim()
    .max(500, "Ghi chú tối đa 500 ký tự")
    .transform((v) => v || undefined),
  paymentMethod: z.enum(PAYMENT_METHODS, "Chọn phương thức thanh toán"),
});
