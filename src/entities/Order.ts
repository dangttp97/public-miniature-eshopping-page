import { z } from "zod";

export const PAYMENT_METHODS = ["cod", "bank_transfer"] as const;

export const orderSchema = z.object({
  id: z.string(),
  status: z.string(),
  createdAt: z.string(),
  userId: z.string().nullable(),
  items: z.array(
    z.object({
      productId: z.string(),
      qty: z.number(),
      priceVnd: z.number(),
    }),
  ),
  customer: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string().optional(),
    address: z.string(),
  }),
  note: z.string().optional(),
  paymentMethod: z.enum(PAYMENT_METHODS),
});

export type Order = z.infer<typeof orderSchema>;
export type PaymentMethod = Order["paymentMethod"];
export type OrderRequest = Pick<Order, "items" | "customer" | "note" | "paymentMethod">;
