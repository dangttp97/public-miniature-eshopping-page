import { Button } from "@/components/Button/Button";
import { Field } from "@/components/Field/Field";
import { Icon } from "@/components/Icon/Icon";
import type { Product } from "@/entities/Product";
import { addToCart, MAX_QTY } from "@/features/cart/cartStore";
import type { FormEventHandler } from "@koniwa/core";
import { useNavigate } from "@koniwa/router";

import css from "./ProductDetails.module.css";

export const AddToCartForm = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const isInStock = product.availability === "in_stock";

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const qty = Number(
      new FormData(e.currentTarget).get("qty"),
    );
    addToCart(product.id, qty);
    navigate("/cart");
  };

  return (
    <form className={css.buy} onSubmit={handleSubmit}>
      <Field
        className={css.qty}
        label="Số lượng"
        name="qty"
        type="number"
        min="1"
        max={MAX_QTY}
        value="1"
        required
        disabled={!isInStock}
      />
      <Button type="submit" className={css.addToCart} disabled={!isInStock}>
        <Icon name="cart" /> {isInStock ? "Thêm vào giỏ" : "Tạm hết hàng"}
      </Button>
    </form>
  );
};
