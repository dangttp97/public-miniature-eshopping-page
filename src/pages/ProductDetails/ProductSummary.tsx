import type { Product } from "@/entities/Product";
import { Availability, Prices } from "@/features/products/ProductCard";

import css from "./ProductDetails.module.css";

export const ProductSummary = ({ product }: { product: Product }) => (
  <>
    <h1>{product.name}</h1>
    <div className={css.meta}>
      <Availability product={product} />
      <span>SKU: {product.sku}</span>
      <span>Danh mục: {product.category}</span>
    </div>
    <Prices product={product} />
    {product.salesNote && <p className={css.note}>{product.salesNote}</p>}
  </>
);
