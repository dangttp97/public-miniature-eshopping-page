import { getOrder } from "@/api/orders";
import { buttonClass } from "@/components/Button/Button";
import { Icon } from "@/components/Icon/Icon";
import { NotFound } from "@/components/NotFound/NotFound";
import { PageStatus } from "@/components/PageStatus/PageStatus";
import { PAYMENT_LABEL } from "@/constants/paymentMethods";
import { withProductNames } from "@/features/orders/orderView";
import { cx } from "@/lib/cx";
import { formatVnd } from "@/lib/format";
import { useAsync } from "@/lib/useAsync";
import { Link, type Page } from "@koniwa/router";

import css from "./OrderDetails.module.css";

const loadOrder = async (id: string) => {
  const order = await getOrder(id);
  return order && withProductNames(order);
};

export const OrderDetails: Page = ({ params }) => {
  const found = useAsync(() => loadOrder(params.id), [params.id]);
  if (found.status !== "done") return <PageStatus state={found} />;

  const order = found.data;
  if (!order) {
    return (
      <NotFound
        title="Không tìm thấy đơn hàng"
        message={`Mã đơn ${params.id} không tồn tại hoặc đã hết hạn lưu trên máy chủ thử nghiệm.`}
      />
    );
  }

  return (
    <div className="page">
      <section className={cx("card", css.wrap)}>
        <div className={css.badge}>
          <Icon name="check" size={36} />
        </div>
        <div>
          <h1>Đặt hàng thành công</h1>
          <p className="muted">
            Cảm ơn {order.customer.name}! Chúng tôi sẽ gọi số{" "}
            {order.customer.phone} để xác nhận đơn.
          </p>
        </div>
        <div>
          <p className="muted">Mã đơn hàng</p>
          <p className={css.code}>{order.id}</p>
        </div>

        <div className={css.details}>
          {order.lines.map((line) => (
            <div key={line.productId} className={css.row}>
              <span>
                {line.name} × {line.qty}
              </span>
              <span>{formatVnd(line.priceVnd * line.qty)}</span>
            </div>
          ))}
          <div className={cx(css.row, css.total)}>
            <span>Tổng cộng</span>
            <span className="price">{formatVnd(order.totalVnd)}</span>
          </div>
          <div className={css.row}>
            <span className="muted">Thanh toán</span>
            <span>{PAYMENT_LABEL[order.paymentMethod]}</span>
          </div>
          <div className={css.row}>
            <span className="muted">Giao đến</span>
            <span>{order.customer.address}</span>
          </div>
        </div>

        <div className={css.actions}>
          <Link to="/" className={buttonClass()}>
            Tiếp tục mua sắm
          </Link>
          {order.userId && (
            <Link to="/orders" className={buttonClass({ variant: "outline" })}>
              Xem đơn hàng của tôi
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};
