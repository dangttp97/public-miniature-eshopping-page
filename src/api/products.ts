import { productSchema } from "@/entities/Product";
import { z } from "zod";

import { FOREVER, getCached, ONE_MINUTE, undefinedIfNotFound } from "./client";

const productList = z.array(productSchema);

export const getProducts = () =>
  getCached(productList, "/api/products", { cacheFor: FOREVER });

export const searchProducts = (keyword: string) =>
  getCached(productList, "/api/products", {
    query: { keyword },
    cacheFor: ONE_MINUTE,
  });

export const getProduct = (id: string) =>
  undefinedIfNotFound(
    getCached(productSchema, `/api/products/${encodeURIComponent(id)}`, {
      cacheFor: FOREVER,
    }),
  );
