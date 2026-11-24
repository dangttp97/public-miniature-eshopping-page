import { type OrderRequest, orderSchema } from "@/entities/Order";
import { z } from "zod";

import { getFresh, post, undefinedIfNotFound } from "./client";

export const createOrder = (order: OrderRequest) =>
  post(orderSchema, "/api/orders", order);

export const getMyOrders = () => getFresh(z.array(orderSchema), "/api/orders");

export const getOrder = (id: string) =>
  undefinedIfNotFound(
    getFresh(orderSchema, `/api/orders/${encodeURIComponent(id)}`),
  );
