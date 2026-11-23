import { Field } from "@/components/Field";
import { Layout } from "@/components/Layout";
import { Cart, loadCart, OrderSummary } from "@/pages/Cart";
import { createOrder, type OrderRequest } from "@/utils/api";
import { validateForm } from "@/utils/form";
import { formatVnd } from "@/utils/format";
import { navigate } from "@/utils/router";
import { checkoutSchema } from "@/utils/schemas";
import { clearCart, getUser } from "@/utils/store";

import css from "./Checkout.module.css";

export const Checkout = async () => {
  const { items, totalVnd } = await loadCart();
  if (!items.length) {
    history.replaceState(history.state, "", "/cart");
    return Cart();
  }
  const user = getUser();

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const button = form.querySelector<HTMLButtonElement>(
      "button[type=submit]",
    )!;
    const alert = form.querySelector<HTMLElement>("[role=alert]")!;
    alert.textContent = "";

    const data = validateForm(form, checkoutSchema);
    if (!data) return;

    const request: OrderRequest = {
      items: items.map(({ product, qty }) => ({
        productId: product.id,
        qty,
        priceVnd: product.priceVnd,
      })),
      customer: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
      },
      note: data.note,
      paymentMethod: data.paymentMethod,
    };

    button.disabled = true;
    button.textContent = "Đang đặt hàng…";
    try {
      const order = await createOrder(request);
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      alert.textContent = `Chưa đặt được hàng: ${(err as Error).message}. Vui lòng thử lại.`;
      button.disabled = false;
      button.textContent = `Đặt hàng · ${formatVnd(totalVnd)}`;
    }
  };

  return (
    <Layout>
      <div className="page">
        <h1>Thanh toán</h1>
        <form className="split" onSubmit={onSubmit} novalidate>
          <div className={css.form}>
            <fieldset className={`card ${css.section}`}>
              <legend>Thông tin nhận hàng</legend>
              <div className={css.cols}>
                <Field
                  label="Họ và tên"
                  name="name"
                  autocomplete="name"
                  required
                  value={user?.name ?? ""}
                />
                <Field
                  label="Số điện thoại"
                  name="phone"
                  type="tel"
                  inputmode="numeric"
                  autocomplete="tel"
                  required
                  hint="10 số, bắt đầu bằng 0"
                />
              </div>
              <Field
                label="Email (không bắt buộc)"
                name="email"
                type="email"
                autocomplete="email"
                value={user?.email ?? ""}
              />
              <Field
                label="Địa chỉ giao hàng"
                name="address"
                autocomplete="street-address"
                required
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
              />
              <Field
                label="Ghi chú (không bắt buộc)"
                name="note"
                multiline
                placeholder="Ví dụ: giao giờ hành chính"
              />
            </fieldset>

            <fieldset className={`card ${css.section}`}>
              <legend>Phương thức thanh toán</legend>
              <label className={css.option}>
                <input type="radio" name="paymentMethod" value="cod" checked />
                <span>
                  <strong>Thanh toán khi nhận hàng (COD)</strong>
                  <span className="hint">
                    Trả tiền mặt cho nhân viên giao hàng.
                  </span>
                </span>
              </label>
              <label className={css.option}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                />
                <span>
                  <strong>Chuyển khoản ngân hàng</strong>
                  <span className="hint">
                    Thông tin tài khoản hiển thị sau khi đặt hàng.
                  </span>
                </span>
              </label>
            </fieldset>
          </div>

          <OrderSummary items={items} totalVnd={totalVnd}>
            <div className={css.items}>
              {items.map(({ product, qty }) => (
                <div className={css.item}>
                  <span>
                    {product.name} × {qty}
                  </span>
                  <span>{formatVnd(product.priceVnd * qty)}</span>
                </div>
              ))}
            </div>
            <p className="alert" role="alert"></p>
            <button type="submit" className="btn btn-primary btn-block">
              Đặt hàng · {formatVnd(totalVnd)}
            </button>
          </OrderSummary>
        </form>
      </div>
    </Layout>
  );
};
