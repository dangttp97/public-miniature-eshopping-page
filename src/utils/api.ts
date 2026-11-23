import { createClient, isWatariError, type HttpMethod, type QueryParams } from "@watari/core";
import { z } from "zod";

import { orderSchema, productSchema, sessionSchema, userSchema, type Order } from "./schemas";
import { getSession, setSession } from "./store";

export type { Order, Product, Session, User } from "./schemas";
export type OrderRequest = Pick<Order, "items" | "customer" | "note" | "paymentMethod">;

const client = createClient({ timeoutMs: 15_000 });

const authHeaders = (): Record<string, string> => {
  const token = getSession()?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const toMessage = (e: unknown) => {
  if (!isWatariError(e)) return e instanceof Error ? e.message : "Đã có lỗi xảy ra";
  switch (e.code) {
    case "HTTP": {
      const { status, body } = e as unknown as { status: number; body?: { error?: string } };
      if (status === 401 && getSession()) setSession(null);
      return body?.error ?? `Máy chủ trả về lỗi ${status}`;
    }
    case "TIMEOUT":
      return "Máy chủ phản hồi quá lâu";
    case "NETWORK":
      return "Không kết nối được máy chủ";
    default:
      return "Dữ liệu từ máy chủ không đọc được";
  }
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

const call = async <S extends z.ZodType>(schema: S, url: string, send: () => Promise<unknown>): Promise<z.output<S>> => {
  let body: unknown;
  try {
    body = await send();
  } catch (e) {
    throw new ApiError(toMessage(e), (e as { status?: number }).status);
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new ApiError(`Dữ liệu từ ${url} không đúng định dạng`);
  return parsed.data;
};

const get = <S extends z.ZodType>(schema: S, url: string, query?: QueryParams, staleTime = 60_000) =>
  call(schema, url, () => client.query({ method: "GET", url, query, staleTime, headers: authHeaders() }));

const send = <S extends z.ZodType>(schema: S, url: string, body?: object, method: HttpMethod = "POST") =>
  call(schema, url, () =>
    client.mutate({ method, url, headers: authHeaders(), body: body && JSON.parse(JSON.stringify(body)) }),
  );

const productList = z.array(productSchema);

export const getProducts = () => get(productList, "/api/products", undefined, Infinity);
export const searchProducts = (keyword: string) => get(productList, "/api/products", { keyword });
export const getProduct = async (id: string) => {
  try {
    return await get(productSchema, `/api/products/${encodeURIComponent(id)}`, undefined, Infinity);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return undefined;
    throw e;
  }
};

export const checkEmail = async (email: string) =>
  (await send(z.object({ exists: z.boolean() }), "/api/auth/check", { email })).exists;
export const login = (email: string, password: string) => send(sessionSchema, "/api/auth/login", { email, password });
export const register = (name: string, email: string, password: string) =>
  send(sessionSchema, "/api/auth/register", { name, email, password });
export const logout = () => send(z.unknown(), "/api/auth/logout").catch(() => undefined);
export const me = () => send(userSchema, "/api/auth/me", undefined, "GET");

export const createOrder = (order: OrderRequest) => send(orderSchema, "/api/orders", order);
export const getMyOrders = () => send(z.array(orderSchema), "/api/orders", undefined, "GET");
export const getOrder = async (id: string) => {
  try {
    return await send(orderSchema, `/api/orders/${encodeURIComponent(id)}`, undefined, "GET");
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return undefined;
    throw e;
  }
};
