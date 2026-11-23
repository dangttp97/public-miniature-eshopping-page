import type { Child } from "jsx-lite-renderer";

import { Icon } from "@/components/Icon";
import { logout } from "@/utils/api";
import { navigate, refresh } from "@/utils/router";
import { cartCount, getUser, setSession } from "@/utils/store";

import css from "./Layout.module.css";

const onSearch = (e: SubmitEvent) => {
  e.preventDefault();
  const keyword = String(new FormData(e.currentTarget as HTMLFormElement).get("keyword") ?? "").trim();
  navigate(keyword ? `/?keyword=${encodeURIComponent(keyword)}` : "/");
};

export const Layout = ({ children }: { children?: Child }) => {
  const user = getUser();
  const count = cartCount();
  const keyword = new URLSearchParams(location.search).get("keyword") ?? "";

  return (
    <>
      <header className={css.header}>
        <div className={`container ${css.bar}`}>
          <a href="/" className={css.logo}>
            <Icon name="chip" size={28} />
            Miniature eShop
          </a>

          <form className={css.search} role="search" onSubmit={onSearch}>
            <label htmlFor="keyword" className="visually-hidden">
              Tìm sản phẩm
            </label>
            <input id="keyword" name="keyword" type="search" className="input" placeholder="Tìm SSD, RAM, VGA…" value={keyword} />
            <button className="btn btn-primary btn-icon" aria-label="Tìm kiếm">
              <Icon name="search" />
            </button>
          </form>

          <nav className={css.nav} aria-label="Tài khoản và giỏ hàng">
            {user ? (
              <>
                <a href="/orders" className="btn btn-ghost">
                  <Icon name="user" />
                  <span>Đơn hàng của {user.name}</span>
                </a>
                <button
                  className="btn btn-ghost"
                  onClick={async () => {
                    await logout();
                    setSession(null);
                    refresh();
                  }}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <a href="/login" className="btn btn-ghost">
                <Icon name="user" />
                Đăng nhập
              </a>
            )}
            <a href="/cart" className={`btn btn-ghost btn-icon ${css.cartLink}`} aria-label={`Giỏ hàng, ${count} sản phẩm`}>
              <Icon name="cart" size={24} />
              {count > 0 && <span className={css.count}>{count}</span>}
            </a>
          </nav>
        </div>
      </header>

      <main className="container">{children}</main>

      <footer className={css.footer}>
        <div className="container">
          Dữ liệu minh hoạ, giá tham khảo từ MemoryZone ngày 21/11/2026. Ảnh sản phẩm là ảnh minh hoạ từ Wikimedia Commons;
          tác giả và giấy phép ghi ở trang chi tiết từng sản phẩm.
        </div>
      </footer>
    </>
  );
};
