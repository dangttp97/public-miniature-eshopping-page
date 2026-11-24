import { buttonClass } from "@/components/Button/Button";
import { hintClass } from "@/components/Field/Field";
import type { CartSummary } from "@/entities/CartItem";
import { OrderSummary } from "@/features/cart/OrderSummary";
import { cx } from "@/lib/cx";
import { ReplaceLink } from "@/lib/navigation";
import { Link } from "@koniwa/router";

import css from "./CheckoutAccountSelection.module.css";

export const CheckoutAccountSelection = ({ items, totalVnd }: CartSummary) => (
  <div className="page">
    <h1>Thanh toán</h1>
    <div className="split">
      <section className={cx("card", css.section)}>
        <h2>Bạn đã có tài khoản?</h2>
        <p className="muted">
          Đăng nhập để điền sẵn thông tin và xem lại đơn trong mục Đơn hàng của
          tôi.
        </p>
        <div className={css.choices}>
          <Link to="/login" className={buttonClass()}>
            Đăng nhập
          </Link>
          <Link to="/register" className={buttonClass({ variant: "outline" })}>
            Tạo tài khoản
          </Link>
        </div>
        <p className={css.or}>hoặc</p>
        <ReplaceLink
          to="/checkout?guest"
          className={buttonClass({ variant: "ghost", block: true })}
        >
          Mua không cần tài khoản
        </ReplaceLink>
        <p className={hintClass}>
          Đơn có thể xem lại bằng mã đơn hiện sau khi đặt.
        </p>
      </section>
      <OrderSummary items={items} totalVnd={totalVnd} />
    </div>
  </div>
);
