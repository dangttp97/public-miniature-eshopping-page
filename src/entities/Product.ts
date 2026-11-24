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
  images: z.array(z.string()).min(1),
  sourceUrl: z.string(),
});

export type Product = z.infer<typeof productSchema>;
