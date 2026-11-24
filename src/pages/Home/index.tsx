import { getProducts, searchProducts } from "@/api/products";
import { buttonClass } from "@/components/Button/Button";
import { Icon } from "@/components/Icon/Icon";
import { PageStatus } from "@/components/PageStatus/PageStatus";
import { CATEGORIES } from "@/constants/categories";
import { ProductCard } from "@/features/products/ProductCard";
import { cx } from "@/lib/cx";
import { useAsync } from "@/lib/useAsync";
import { Link, useLocation } from "@koniwa/router";

import css from "./Home.module.css";
import { SideBar } from "./SideBar";

export const Home = () => {
  const query = new URLSearchParams(useLocation().search);
  const keyword = query.get("keyword")?.trim() ?? "";
  const category = query.get("category") ?? "";

  const found = useAsync(
    () => (keyword ? searchProducts(keyword) : getProducts()),
    [keyword],
  );
  if (found.status !== "done") return <PageStatus state={found} />;

  const products = category
    ? found.data.filter((p) => p.category === category)
    : found.data;
  const current = CATEGORIES.find((c) => c.code === category);

  return (
    <div className={cx("page", css.layout)}>
      <SideBar
        categories={CATEGORIES}
        products={found.data}
        keyword={keyword}
        category={category}
      />
      <div className={css.content}>
        {!keyword && !category && (
          <section className={css.hero}>
            <h1>Linh kiện máy tính chính hãng</h1>
            <p>
              SSD, RAM, VGA, CPU và phụ kiện cho máy bàn, laptop. Giá niêm yết
              rõ ràng, bảo hành theo hãng.
            </p>
            <div className={css.perks}>
              <span>
                <Icon name="truck" /> Giao nhanh nội thành
              </span>
              <span>
                <Icon name="shield" /> Bảo hành chính hãng
              </span>
            </div>
          </section>
        )}

        <div className={css.head}>
          <h2>
            {keyword
              ? `Kết quả cho “${keyword}”`
              : (current?.label ?? "Tất cả sản phẩm")}
          </h2>
          <span className="muted">{products.length} sản phẩm</span>
        </div>

        {products.length ? (
          <div className={css.grid}>
            {products.map((p) => (
              <ProductCard product={p} />
            ))}
          </div>
        ) : (
          <div className={cx("card", css.empty)}>
            <h3>Không tìm thấy sản phẩm phù hợp</h3>
            <p className="muted">
              Thử từ khoá khác, ví dụ “SSD” hoặc “Samsung”.
            </p>
            <Link to="/" className={buttonClass({ variant: "outline" })}>
              Xem tất cả sản phẩm
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
