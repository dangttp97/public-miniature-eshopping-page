import {
  createClient,
  type HttpMethod,
  isWatariError,
  type QueryParams,
} from "@watari/core";
import { z } from "zod";

import { getSession, setSession } from "./session";

const client = createClient({ timeoutMs: 15_000 });

export const FOREVER = Infinity;
export const ONE_MINUTE = 60_000;

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
  if (!isWatariError(error))
    return new ApiError(
      error instanceof Error ? error.message : "Đã có lỗi xảy ra",
    );

  switch (error.code) {
    case "HTTP": {
      const { status, body } = error as unknown as {
        status: number;
        body?: { error?: string };
      };
      return new ApiError(
        body?.error ?? `Máy chủ trả về lỗi ${status}`,
        status,
      );
    }
    case "TIMEOUT":
      return new ApiError("Hết thời gian phản hồi");
    case "NETWORK":
      return new ApiError("Không kết nối được máy chủ");
    default:
      return new ApiError("Dữ liệu từ máy chủ không đọc được");
  }
};

const request = async <S extends z.ZodType>(
  schema: S,
  url: string,
  run: () => Promise<unknown>,
) => {
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
  if (!parsed.success)
    throw new ApiError(`Dữ liệu từ ${url} không đúng định dạng`);
  return parsed.data as z.output<S>;
};

export const getCached = <S extends z.ZodType>(
  schema: S,
  url: string,
  options: { query?: QueryParams; cacheFor: number },
) =>
  request(schema, url, () =>
    client.query({
      method: "GET",
      url,
      query: options.query,
      staleTime: options.cacheFor,
      headers: authHeaders(),
    }),
  );

export const getFresh = <S extends z.ZodType>(schema: S, url: string) =>
  request(schema, url, () =>
    client.request({ method: "GET", url, headers: authHeaders() }),
  );

const withoutUndefinedFields = (body: object) =>
  JSON.parse(JSON.stringify(body));

export const post = <S extends z.ZodType>(
  schema: S,
  url: string,
  body?: object,
  method: HttpMethod = "POST",
) =>
  request(schema, url, () =>
    client.mutate({
      method,
      url,
      headers: authHeaders(),
      body: body && withoutUndefinedFields(body),
    }),
  );

export const undefinedIfNotFound = async <T>(load: Promise<T>) => {
  try {
    return await load;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined;
    throw error;
  }
};
