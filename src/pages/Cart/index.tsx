import { Button, buttonClass } from "@/components/Button/Button";
import { Icon } from "@/components/Icon/Icon";
import { PageStatus } from "@/components/PageStatus/PageStatus";
import { OrderSummary } from "@/features/cart/OrderSummary";
import { MAX_QTY, setQty } from "@/features/cart/cartStore";
import { useCartItems } from "@/features/cart/useCartItems";
import { cx } from "@/lib/cx";
import { formatVnd } from "@/lib/format";
import { Link } from "@koniwa/router";

import css from "./Cart.module.css";

const EmptyCart = () => (
  <div className="page">
    <div className={cx("card", css.empty)}>
      <Icon name="cart" size={48} />
      <h1>Giỏ hàng đang trống</h1>
      <p className="muted">Chọn vài linh kiện rồi quay lại đây nhé.</p>
      <Link to="/" className={buttonClass()}>
        Tiếp tục mua sắm
      </Link>
    </div>
  </div>
);

export const Cart = () => {
  const cart = useCartItems();
  if (cart.status !== "done") return <PageStatus state={cart} />;

  const { items, totalVnd } = cart.data;
  if (!items.length) return <EmptyCart />;

  return (
    <div className="page">
      <h1>Giỏ hàng</h1>
      <div className="split">
        <section
          className={cx("card", css.list)}
          aria-label="Sản phẩm trong giỏ"
        >
          {items.map(({ product, qty }) => (
            <article key={product.id} className={css.line}>
              <img src={product.images[0]} alt="" width="80" height="80" />
              <div>
                <h3>
                  <Link to={`/products/${product.id}`}>{product.name}</Link>
                </h3>
                <span className="price">{formatVnd(product.priceVnd)}</span>
              </div>
              <div className={css.controls}>
                <div
                  className={css.stepper}
                  role="group"
                  aria-label={`Số lượng ${product.name}`}
                >
                  <Button
                    variant="ghost"
                    iconOnly
                    aria-label="Giảm"
                    disabled={qty <= 1}
                    onClick={() => setQty(product.id, qty - 1)}
                  >
                    <Icon name="minus" />
                  </Button>
                  <output aria-live="polite">{qty}</output>
                  <Button
                    variant="ghost"
                    iconOnly
                    aria-label="Tăng"
                    disabled={qty >= MAX_QTY}
                    onClick={() => setQty(product.id, qty + 1)}
                  >
                    <Icon name="plus" />
                  </Button>
                </div>
                <Button variant="ghost" onClick={() => setQty(product.id, 0)}>
                  <Icon name="trash" /> Xoá
                </Button>
              </div>
            </article>
          ))}
        </section>

        <OrderSummary items={items} totalVnd={totalVnd}>
          <Link to="/checkout" className={buttonClass({ block: true })}>
            Tiến hành thanh toán
          </Link>
          <Link
            to="/"
            className={buttonClass({ variant: "ghost", block: true })}
          >
            Tiếp tục mua sắm
          </Link>
        </OrderSummary>
      </div>
    </div>
  );
};
