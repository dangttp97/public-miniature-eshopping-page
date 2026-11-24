import type { CartSummary } from "@/entities/CartItem";
import { cx } from "@/lib/cx";
import { formatVnd } from "@/lib/format";
import type { Child } from "@koniwa/core";

import css from "./OrderSummary.module.css";

export const OrderSummary = ({
  items,
  totalVnd,
  children,
}: CartSummary & { children?: Child }) => (
  <aside className={cx("card", css.summary)} aria-label="Tóm tắt đơn hàng">
    <h2>Tóm tắt đơn hàng</h2>
    <div className={css.row}>
      <span className="muted">
        Tạm tính ({items.reduce((n, item) => n + item.qty, 0)} sản phẩm)
      </span>
      <span>{formatVnd(totalVnd)}</span>
    </div>
    <div className={css.row}>
      <span className="muted">Phí giao hàng</span>
      <span>Miễn phí</span>
    </div>
    <div className={cx(css.row, css.total)}>
      <span>Tổng cộng</span>
      <span className="price">{formatVnd(totalVnd)}</span>
    </div>
    {children}
  </aside>
);
