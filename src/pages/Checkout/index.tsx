import { createOrder } from "@/api/orders";
import { Button } from "@/components/Button/Button";
import { Field } from "@/components/Field/Field";
import { PageStatus } from "@/components/PageStatus/PageStatus";
import { Radio } from "@/components/Radio/Radio";
import { PAYMENT_OPTIONS } from "@/constants/paymentMethods";
import type { OrderRequest, PaymentMethod } from "@/entities/Order";
import { useUser } from "@/features/auth/user";
import { OrderSummary } from "@/features/cart/OrderSummary";
import { clearCart } from "@/features/cart/cartStore";
import { useCartItems } from "@/features/cart/useCartItems";
import { cx } from "@/lib/cx";
import { validateForm } from "@/lib/form";
import { formatVnd } from "@/lib/format";
import { Redirect } from "@/lib/navigation";
import { type FormEventHandler, useState } from "@koniwa/core";
import { Link, useLocation, useNavigate } from "@koniwa/router";

import css from "./Checkout.module.css";
import { CheckoutAccountSelection } from "./CheckoutAccountSelection";
import { checkoutSchema } from "./checkoutSchema";

export const Checkout = () => {
  const user = useUser();
  const cart = useCartItems();
  const navigate = useNavigate();
  const isGuest = new URLSearchParams(useLocation().search).has("guest");
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (cart.status !== "done") return <PageStatus state={cart} />;
  const { items, totalVnd } = cart.data;
  if (!items.length && !isSubmitting) return <Redirect to="/cart" replace />;
  if (!user && !isGuest)
    return <CheckoutAccountSelection items={items} totalVnd={totalVnd} />;

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");
    const data = validateForm(e.currentTarget, checkoutSchema);
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

    setSubmitting(true);
    try {
      const order = await createOrder(request);
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(
        `Chưa đặt được hàng: ${(err as Error).message}. Vui lòng thử lại.`,
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h1>Thanh toán</h1>
      {user ? (
        <p className="muted">Đặt hàng với tài khoản {user.email}.</p>
      ) : (
        <p className="muted">
          Bạn đang mua không cần tài khoản. <Link to="/login">Đăng nhập</Link>
        </p>
      )}
      <form className="split" onSubmit={handleSubmit} noValidate>
        <div className={css.form}>
          <fieldset className={cx("card", css.section)}>
            <legend>Thông tin nhận hàng</legend>
            <div className={css.cols}>
              <Field
                label="Họ và tên"
                name="name"
                autocomplete="name"
                required
                value={name}
                onInput={(e) => setName(e.currentTarget.value)}
              />
              <Field
                label="Số điện thoại"
                name="phone"
                type="tel"
                inputMode="numeric"
                autocomplete="tel"
                required
                placeholder="Ví dụ: 0912345678"
              />
            </div>
            <Field
              label="Email (không bắt buộc)"
              name="email"
              type="email"
              autocomplete="email"
              value={email}
              onInput={(e) => setEmail(e.currentTarget.value)}
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

          <fieldset className={cx("card", css.section)}>
            <legend>Phương thức thanh toán</legend>
            {PAYMENT_OPTIONS.map((option) => (
              <Radio
                key={option.value}
                name="paymentMethod"
                value={option.value}
                label={option.label}
                hint={option.hint}
                checked={paymentMethod === option.value}
                onChange={() => setPaymentMethod(option.value)}
              />
            ))}
          </fieldset>
        </div>

        <OrderSummary items={items} totalVnd={totalVnd}>
          <div className={css.items}>
            {items.map(({ product, qty }) => (
              <div key={product.id} className={css.item}>
                <span>
                  {product.name} × {qty}
                </span>
                <span>{formatVnd(product.priceVnd * qty)}</span>
              </div>
            ))}
          </div>
          <p className="alert" role="alert">
            {error}
          </p>
          <Button type="submit" block disabled={isSubmitting}>
            {isSubmitting
              ? "Đang đặt hàng…"
              : `Đặt hàng · ${formatVnd(totalVnd)}`}
          </Button>
        </OrderSummary>
      </form>
    </div>
  );
};
