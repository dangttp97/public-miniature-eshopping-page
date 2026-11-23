import { createClient, isWatariError, type HttpMethod, type QueryParams } from "@watari/core";
import { z } from "zod";

import { orderSchema, productSchema, sessionSchema, type Order } from "./schemas";
import { getSession, setSession } from "./store";

export type { Order, Product, Session, User } from "./schemas";
export type OrderRequest = Pick<Order, "items" | "customer" | "note" | "paymentMethod">;

const client = createClient({ timeoutMs: 15_000 });

const FOREVER = Infinity;
const ONE_MINUTE = 60_000;

class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

const authHeaders = (): Record<string, string> => {
  const token = getSession()?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const toApiError = (error: unknown): ApiError => {
  if (!isWatariError(error)) return new ApiError(error instanceof Error ? error.message : "Đã có lỗi xảy ra");

  switch (error.code) {
    case "HTTP": {
      const { status, body } = error as unknown as { status: number; body?: { error?: string } };
      return new ApiError(body?.error ?? `Máy chủ trả về lỗi ${status}`, status);
    }
    case "TIMEOUT":
      return new ApiError("Máy chủ phản hồi quá lâu");
    case "NETWORK":
      return new ApiError("Không kết nối được máy chủ");
    default:
      return new ApiError("Dữ liệu từ máy chủ không đọc được");
  }
};

const request = async <S extends z.ZodType>(schema: S, url: string, run: () => Promise<unknown>) => {
  let body: unknown;
  try {
    body = await run();
  } catch (error) {
    const apiError = toApiError(error);
    const sessionExpired = apiError.status === 401 && getSession();
    if (sessionExpired) setSession(null);
    throw apiError;
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new ApiError(`Dữ liệu từ ${url} không đúng định dạng`);
  return parsed.data as z.output<S>;
};

const getCached = <S extends z.ZodType>(schema: S, url: string, options: { query?: QueryParams; cacheFor: number }) =>
  request(schema, url, () =>
    client.query({ method: "GET", url, query: options.query, staleTime: options.cacheFor, headers: authHeaders() }),
  );

const getFresh = <S extends z.ZodType>(schema: S, url: string) =>
  request(schema, url, () => client.request({ method: "GET", url, headers: authHeaders() }));

const withoutUndefinedFields = (body: object) => JSON.parse(JSON.stringify(body));

const post = <S extends z.ZodType>(schema: S, url: string, body?: object, method: HttpMethod = "POST") =>
  request(schema, url, () =>
    client.mutate({ method, url, headers: authHeaders(), body: body && withoutUndefinedFields(body) }),
  );

const undefinedIfNotFound = async <T>(load: Promise<T>) => {
  try {
    return await load;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined;
    throw error;
  }
};

const productList = z.array(productSchema);

export const getProducts = () => getCached(productList, "/api/products", { cacheFor: FOREVER });

export const searchProducts = (keyword: string) =>
  getCached(productList, "/api/products", { query: { keyword }, cacheFor: ONE_MINUTE });

export const getProduct = (id: string) =>
  undefinedIfNotFound(getCached(productSchema, `/api/products/${encodeURIComponent(id)}`, { cacheFor: FOREVER }));

export const checkEmail = async (email: string) => {
  const { exists } = await post(z.object({ exists: z.boolean() }), "/api/auth/check", { email });
  return exists;
};

export const login = (email: string, password: string) => post(sessionSchema, "/api/auth/login", { email, password });

export const register = (name: string, email: string, password: string) =>
  post(sessionSchema, "/api/auth/register", { name, email, password });

export const logout = () => post(z.unknown(), "/api/auth/logout").catch(() => undefined);

export const createOrder = (order: OrderRequest) => post(orderSchema, "/api/orders", order);

export const getMyOrders = () => getFresh(z.array(orderSchema), "/api/orders");

export const getOrder = (id: string) =>
  undefinedIfNotFound(getFresh(orderSchema, `/api/orders/${encodeURIComponent(id)}`));
