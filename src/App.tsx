import type { Child } from "jsx-lite-renderer";

import { Layout } from "@/components/Layout";
import { Auth } from "@/pages/Auth";
import { Cart } from "@/pages/Cart";
import { Checkout } from "@/pages/Checkout";
import { Home } from "@/pages/Home";
import { Orders } from "@/pages/Orders";
import { OrderSuccess } from "@/pages/OrderSuccess";
import { ProductPage } from "@/pages/Product";
import { refresh, startRouter } from "@/utils/router";

const Message = ({ title, children }: { title: string; children?: Child }) => (
  <Layout>
    <div className="page">
      <h1>{title}</h1>
      {children}
    </div>
  </Layout>
);

export const startApp = (root: Element) =>
  startRouter(
    {
      "/": Home,
      "/products/:id": ProductPage,
      "/cart": Cart,
      "/checkout": Checkout,
      "/orders": Orders,
      "/orders/:id": OrderSuccess,
      "/login": Auth,
      "/register": Auth,
      "*": () => (
        <Message title="Không tìm thấy trang">
          <a href="/" className="btn btn-outline">
            Về trang chủ
          </a>
        </Message>
      ),
    },
    root,
    {
      loading: () => (
        <Layout>
          <div className="page" aria-busy="true" aria-label="Đang tải">
            <div className="skeleton" style={{ height: "160px" }} />
            <div className="skeleton" style={{ height: "320px" }} />
          </div>
        </Layout>
      ),
      error: (e) => (
        <Message title="Không tải được dữ liệu">
          <p className="muted">{e.message}. Kiểm tra WireMock đã chạy chưa (yarn mock).</p>
          <button className="btn btn-primary" onClick={() => refresh()}>
            Thử lại
          </button>
        </Message>
      ),
    },
  );
