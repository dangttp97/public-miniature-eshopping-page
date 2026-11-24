import { Button, buttonClass } from "@/components/Button/Button";
import { inputClass } from "@/components/Field/Field";
import { Icon } from "@/components/Icon/Icon";
import { signOut, useUser } from "@/features/auth/user";
import { useCart } from "@/features/cart/cartStore";
import { cx } from "@/lib/cx";
import type { Child } from "@koniwa/core";
import { Link, useLocation, useNavigate } from "@koniwa/router";

import css from "./Layout.module.css";

export const Layout = ({ children }: { children?: Child }) => {
  const user = useUser();
  const cart = useCart();
  const navigate = useNavigate();
  const keyword =
    new URLSearchParams(useLocation().search).get("keyword") ?? "";
  const count = cart.reduce((total, line) => total + line.qty, 0);

  const handleSearch = (e: SubmitEvent) => {
    e.preventDefault();
    const typed = String(
      new FormData(e.currentTarget as HTMLFormElement).get("keyword") ?? "",
    ).trim();
    navigate(typed ? `/?keyword=${encodeURIComponent(typed)}` : "/");
  };

  return (
    <>
      <header className={css.header}>
        <div className={cx("container", css.bar)}>
          <Link to="/" className={css.logo}>
            <Icon name="chip" size={28} />
            Miniature eShop
          </Link>

          <form className={css.search} role="search" onSubmit={handleSearch}>
            <label htmlFor="keyword" className="visually-hidden">
              Tìm sản phẩm
            </label>
            <input
              id="keyword"
              name="keyword"
              type="search"
              className={cx(inputClass, css.searchInput)}
              placeholder="Tìm SSD, RAM, VGA…"
              value={keyword}
            />
            <Button iconOnly className={css.searchButton} aria-label="Tìm kiếm">
              <Icon name="search" />
            </Button>
          </form>

          <nav className={css.nav} aria-label="Tài khoản và giỏ hàng">
            {user ? (
              <>
                <Link to="/orders" className={buttonClass({ variant: "ghost" })}>
                  <Icon name="user" />
                  <span>Đơn hàng của {user.name}</span>
                </Link>
                <Button variant="ghost" onClick={signOut}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <Link to="/login" className={buttonClass({ variant: "ghost" })}>
                <Icon name="user" />
                Đăng nhập
              </Link>
            )}
            <Link
              to="/cart"
              className={buttonClass(
                { variant: "ghost", iconOnly: true },
                css.cartLink,
              )}
              aria-label={`Giỏ hàng, ${count} sản phẩm`}
            >
              <Icon name="cart" size={24} />
              {count > 0 && <span className={css.count}>{count}</span>}
            </Link>
          </nav>
        </div>
      </header>

      <main className="container">{children}</main>
    </>
  );
};
