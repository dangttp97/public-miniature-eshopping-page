import { Icon } from "@/components/Icon";
import { Layout } from "@/components/Layout";
import { getOrder } from "@/utils/api";
import { formatVnd } from "@/utils/format";
import { PAYMENT_LABEL, withProductNames } from "@/utils/orders";

import css from "./OrderSuccess.module.css";

export const OrderSuccess = async ({ params }: { params: Record<string, string> }) => {
  const found = await getOrder(params.id);

  if (!found) {
    return (
      <Layout>
        <div className="page">
          <section className={`card ${css.wrap}`}>
            <h1>Không tìm thấy đơn hàng</h1>
            <p className="muted">Mã đơn {params.id} không tồn tại hoặc đã hết hạn lưu trên máy chủ thử nghiệm.</p>
            <a href="/" className="btn btn-primary">
              Về trang chủ
            </a>
          </section>
        </div>
      </Layout>
    );
  }

  const order = await withProductNames(found);

  return (
    <Layout>
      <div className="page">
        <section className={`card ${css.wrap}`}>
          <div className={css.badge}>
            <Icon name="check" size={36} />
          </div>
          <div>
            <h1>Đặt hàng thành công</h1>
            <p className="muted">
              Cảm ơn {order.customer.name}! Chúng tôi sẽ gọi số {order.customer.phone} để xác nhận đơn.
            </p>
          </div>
          <div>
            <p className="muted">Mã đơn hàng</p>
            <p className={css.code}>{order.id}</p>
          </div>

          <div className={css.details}>
            {order.lines.map((l) => (
              <div className={css.row}>
                <span>
                  {l.name} × {l.qty}
                </span>
                <span>{formatVnd(l.priceVnd * l.qty)}</span>
              </div>
            ))}
            <div className={`${css.row} ${css.total}`}>
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
            <a href="/" className="btn btn-primary">
              Tiếp tục mua sắm
            </a>
            {order.userId && (
              <a href="/orders" className="btn btn-outline">
                Xem đơn hàng của tôi
              </a>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};
