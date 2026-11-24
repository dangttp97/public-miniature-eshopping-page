import type { Product } from "@/entities/Product";
import { cx } from "@/lib/cx";
import { discountPercent, formatVnd } from "@/lib/format";
import { Link } from "@koniwa/router";

import css from "./ProductCard.module.css";

export const Availability = ({ product }: { product: Product }) =>
  product.availability === "in_stock" ? (
    <span className="badge badge-success">Còn hàng</span>
  ) : (
    <span className="badge badge-neutral">Hết hàng</span>
  );

export const Prices = ({ product }: { product: Product }) => {
  const off = discountPercent(product.priceVnd, product.originalPriceVnd);
  return (
    <div className={css.prices}>
      <span className="price">{formatVnd(product.priceVnd)}</span>
      {off > 0 && (
        <>
          <s className={css.was}>
            <span className="visually-hidden">Giá gốc </span>
            {formatVnd(product.originalPriceVnd)}
          </s>
          <span className="badge badge-deal">-{off}%</span>
        </>
      )}
    </div>
  );
};

export const ProductCard = ({ product }: { product: Product }) => (
  <article className={cx("card", css.card)}>
    <div className={css.media}>
      <img
        src={product.images[0]}
        alt=""
        loading="lazy"
        decoding="async"
        width="600"
        height="600"
      />
    </div>
    <div className={css.body}>
      <div className={css.meta}>
        <span className={css.category}>{product.category}</span>
        <Availability product={product} />
      </div>
      <h3 className={css.name}>
        <Link to={`/products/${product.id}`}>{product.name}</Link>
      </h3>
      <Prices product={product} />
    </div>
  </article>
);
