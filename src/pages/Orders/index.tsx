import { getMyOrders } from "@/api/orders";
import { buttonClass } from "@/components/Button/Button";
import { PageStatus } from "@/components/PageStatus/PageStatus";
import { PAYMENT_LABEL } from "@/constants/paymentMethods";
import { useUser } from "@/features/auth/user";
import {
  formatOrderDate,
  STATUS_LABEL,
  withProductNames,
} from "@/features/orders/orderView";
import { cx } from "@/lib/cx";
import { formatVnd } from "@/lib/format";
import { Redirect } from "@/lib/navigation";
import { useAsync } from "@/lib/useAsync";
import { Link } from "@koniwa/router";

import css from "./Orders.module.css";

const loadMyOrders = async () =>
  Promise.all((await getMyOrders()).map(withProductNames));

export const Orders = () => {
  const user = useUser();
  const orders = useAsync(
    () => (user ? loadMyOrders() : Promise.resolve([])),
    [user?.id],
  );

  if (!user) return <Redirect to="/login" />;
  if (orders.status !== "done") return <PageStatus state={orders} />;

  return (
    <div className="page">
      <h1>Đơn hàng của tôi</h1>

      {orders.data.length ? (
        <div className={css.list}>
          {orders.data.map((o) => (
            <Link
              key={o.id}
              to={`/orders/${o.id}`}
              className={cx("card", css.order)}
            >
              <span className={css.code}>{o.id}</span>
              <span className="price">{formatVnd(o.totalVnd)}</span>
              <div className={css.meta}>
                <span className="badge badge-deal">
                  {STATUS_LABEL[o.status] ?? o.status}
                </span>
                <span>{formatOrderDate(o.createdAt)}</span>
                <span>{PAYMENT_LABEL[o.paymentMethod]}</span>
              </div>
              <span className={css.items}>
                {o.lines.map((l) => `${l.name} × ${l.qty}`).join(", ")}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className={cx("card", css.empty)}>
          <h2>Chưa có đơn hàng nào</h2>
          <p className="muted">Đơn bạn đặt khi đã đăng nhập sẽ hiện ở đây.</p>
          <Link to="/" className={buttonClass()}>
            Mua sắm ngay
          </Link>
        </div>
      )}
    </div>
  );
};
