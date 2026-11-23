import type { Child } from "jsx-lite-renderer";

import { Icon } from "@/components/Icon";
import { Layout } from "@/components/Layout";
import { getProducts, type Product } from "@/utils/api";
import { wikimediaThumbnail, formatVnd } from "@/utils/format";
import { refresh } from "@/utils/router";
import { getCart, MAX_QTY, setQty } from "@/utils/store";

import css from "./Cart.module.css";

export type CartItem = { product: Product; qty: number };

export const loadCart = async () => {
  const products = await getProducts();
  const items = getCart().flatMap(({ productId, qty }) => {
    const product = products.find((p) => p.id === productId);
    return product ? [{ product, qty }] : [];
  });
  return { items, totalVnd: items.reduce((sum, i) => sum + i.product.priceVnd * i.qty, 0) };
};

export const OrderSummary = ({ items, totalVnd, children }: { items: CartItem[]; totalVnd: number; children?: Child }) => (
  <aside className={`card ${css.summary}`} aria-label="Tóm tắt đơn hàng">
    <h2>Tóm tắt đơn hàng</h2>
    <div className={css.row}>
      <span className="muted">Tạm tính ({items.reduce((n, i) => n + i.qty, 0)} sản phẩm)</span>
      <span>{formatVnd(totalVnd)}</span>
    </div>
    <div className={css.row}>
      <span className="muted">Phí giao hàng</span>
      <span>Miễn phí</span>
    </div>
    <div className={`${css.row} ${css.total}`}>
      <span>Tổng cộng</span>
      <span className="price">{formatVnd(totalVnd)}</span>
    </div>
    {children}
  </aside>
);

const change = (id: string, qty: number) => {
  setQty(id, qty);
  refresh();
};

export const Cart = async () => {
  const { items, totalVnd } = await loadCart();

  if (!items.length) {
    return (
      <Layout>
        <div className="page">
          <div className={`card ${css.empty}`}>
            <Icon name="cart" size={48} />
            <h1>Giỏ hàng đang trống</h1>
            <p className="muted">Chọn vài linh kiện rồi quay lại đây nhé.</p>
            <a href="/" className="btn btn-primary">
              Tiếp tục mua sắm
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1>Giỏ hàng</h1>
        <div className="split">
          <section className={`card ${css.list}`} aria-label="Sản phẩm trong giỏ">
            {items.map(({ product, qty }) => (
              <article className={css.line}>
                <img src={wikimediaThumbnail(product.imageUrl, 160)} alt="" width="80" height="80" />
                <div>
                  <h3>
                    <a href={`/products/${product.id}`}>{product.name}</a>
                  </h3>
                  <span className="price">{formatVnd(product.priceVnd)}</span>
                </div>
                <div className={css.controls}>
                  <div className={css.stepper} role="group" aria-label={`Số lượng ${product.name}`}>
                    <button className="btn btn-ghost btn-icon" aria-label="Giảm" disabled={qty <= 1} onClick={() => change(product.id, qty - 1)}>
                      <Icon name="minus" />
                    </button>
                    <output aria-live="polite">{qty}</output>
                    <button className="btn btn-ghost btn-icon" aria-label="Tăng" disabled={qty >= MAX_QTY} onClick={() => change(product.id, qty + 1)}>
                      <Icon name="plus" />
                    </button>
                  </div>
                  <button className="btn btn-ghost" onClick={() => change(product.id, 0)}>
                    <Icon name="trash" /> Xoá
                  </button>
                </div>
              </article>
            ))}
          </section>

          <OrderSummary items={items} totalVnd={totalVnd}>
            <a href="/checkout" className="btn btn-primary btn-block">
              Tiến hành thanh toán
            </a>
            <a href="/" className="btn btn-ghost btn-block">
              Tiếp tục mua sắm
            </a>
          </OrderSummary>
        </div>
      </div>
    </Layout>
  );
};
