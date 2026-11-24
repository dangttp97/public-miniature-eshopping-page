import { NotFound } from "@/components/NotFound/NotFound";
import { Layout } from "@/layout/Layout";
import { Cart } from "@/pages/Cart";
import { Checkout } from "@/pages/Checkout";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { OrderDetails } from "@/pages/OrderDetails";
import { Orders } from "@/pages/Orders";
import { ProductDetails } from "@/pages/ProductDetails";
import { Register } from "@/pages/Register";
import { Router, type Page } from "@koniwa/router";

const withLayout =
  (Content: Page): Page =>
  (props) => (
    <Layout>
      <Content {...props} />
    </Layout>
  );

const PageNotFound: Page = () => <NotFound title="Không tìm thấy trang" />;

const routes = {
  "/": Home,
  "/products/:id": ProductDetails,
  "/cart": Cart,
  "/checkout": Checkout,
  "/orders": Orders,
  "/orders/:id": OrderDetails,
  "/login": Login,
  "/register": Register,
  "*": PageNotFound,
};

const routesWithLayout = Object.fromEntries(
  Object.entries(routes).map(([path, page]) => [path, withLayout(page)]),
);

export const App = () => <Router routes={routesWithLayout} />;
