import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  category: z.string(),
  priceVnd: z.number(),
  originalPriceVnd: z.number(),
  availability: z.enum(["in_stock", "out_of_stock"]),
  salesNote: z.string().optional(),
  specs: z.record(z.string(), z.string()),
  imageUrl: z.string(),
  imageAttribution: z.object({
    creator: z.string(),
    license: z.string(),
    sourceUrl: z.string(),
  }),
  sourceUrl: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export const sessionSchema = z.object({ user: userSchema, token: z.string() });

export const orderSchema = z.object({
  id: z.string(),
  status: z.string(),
  createdAt: z.string(),
  userId: z.string().nullable(),
  items: z.array(z.object({ productId: z.string(), qty: z.number(), priceVnd: z.number() })),
  customer: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string().optional(),
    address: z.string(),
  }),
  note: z.string().optional(),
  paymentMethod: z.enum(["cod", "bank_transfer"]),
});

const email = z.string().trim().toLowerCase().pipe(z.email("Email chưa đúng định dạng"));
const required = (label: string) => z.string().trim().min(1, `Vui lòng nhập ${label}`);

export const emailSchema = z.object({ email });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export const registerSchema = z.object({
  name: required("họ và tên"),
  email,
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export const checkoutSchema = z.object({
  name: required("họ và tên"),
  phone: z
    .string()
    .trim()
    .regex(/^0\d{9}$/, "Số điện thoại gồm 10 số, bắt đầu bằng 0"),
  email: z.union([z.literal(""), email]).transform((v) => v || undefined),
  address: required("địa chỉ giao hàng").min(10, "Địa chỉ quá ngắn, thêm phường/quận/tỉnh"),
  note: z
    .string()
    .trim()
    .max(500, "Ghi chú tối đa 500 ký tự")
    .transform((v) => v || undefined),
  paymentMethod: z.enum(["cod", "bank_transfer"], "Chọn phương thức thanh toán"),
});

export type Product = z.infer<typeof productSchema>;
export type User = z.infer<typeof userSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type Order = z.infer<typeof orderSchema>;
