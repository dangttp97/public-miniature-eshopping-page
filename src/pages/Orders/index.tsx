import { Layout } from "@/components/Layout";
import { getMyOrders } from "@/utils/api";
import { formatVnd } from "@/utils/format";
import { formatOrderDate, PAYMENT_LABEL, STATUS_LABEL, withProductNames } from "@/utils/orders";
import { navigate } from "@/utils/router";
import { getUser } from "@/utils/store";

import css from "./Orders.module.css";

const toLogin = () => {
  queueMicrotask(() => navigate("/login"));
  return null;
};

export const Orders = async () => {
  if (!getUser()) return toLogin();

  const found = await getMyOrders().catch((e) => {
    if (!getUser()) return null;
    throw e;
  });
  if (!found) return toLogin();
  const orders = await Promise.all(found.map(withProductNames));

  return (
    <Layout>
      <div className="page">
        <h1>Đơn hàng của tôi</h1>

        {orders.length ? (
          <div className={css.list}>
            {orders.map((o) => (
              <a href={`/orders/${o.id}`} className={`card ${css.order}`}>
                <span className={css.code}>{o.id}</span>
                <span className="price">{formatVnd(o.totalVnd)}</span>
                <div className={css.meta}>
                  <span className="badge badge-deal">{STATUS_LABEL[o.status] ?? o.status}</span>
                  <span>{formatOrderDate(o.createdAt)}</span>
                  <span>{PAYMENT_LABEL[o.paymentMethod]}</span>
                </div>
                <span className={css.items}>{o.lines.map((l) => `${l.name} × ${l.qty}`).join(", ")}</span>
              </a>
            ))}
          </div>
        ) : (
          <div className={`card ${css.empty}`}>
            <h2>Chưa có đơn hàng nào</h2>
            <p className="muted">Đơn bạn đặt khi đã đăng nhập sẽ hiện ở đây.</p>
            <a href="/" className="btn btn-primary">
              Mua sắm ngay
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
};
