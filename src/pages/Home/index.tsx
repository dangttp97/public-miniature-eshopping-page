import { Icon, type IconName } from "@/components/Icon";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { getProducts, searchProducts } from "@/utils/api";

import css from "./Home.module.css";

const CATEGORIES: { code: string; label: string; icon: IconName }[] = [
  { code: "", label: "Tất cả sản phẩm", icon: "grid" },
  { code: "SSD", label: "Ổ cứng SSD", icon: "drive" },
  { code: "RAM", label: "RAM", icon: "memory" },
  { code: "USB", label: "USB", icon: "usb" },
  { code: "HDD", label: "Ổ cứng di động", icon: "portable" },
  { code: "CPU", label: "CPU", icon: "chip" },
  { code: "VGA", label: "Card màn hình", icon: "gpu" },
  { code: "PSU", label: "Nguồn máy tính", icon: "power" },
  { code: "Case", label: "Vỏ case", icon: "tower" },
];

export const Home = async () => {
  const query = new URLSearchParams(location.search);
  const keyword = query.get("keyword")?.trim() ?? "";
  const category = query.get("category") ?? "";

  const found = await (keyword ? searchProducts(keyword) : getProducts());
  const products = category ? found.filter((p) => p.category === category) : found;
  const count = (code: string) => (code ? found.filter((p) => p.category === code).length : found.length);
  const href = (code: string) => `/?${new URLSearchParams({ ...(keyword && { keyword }), ...(code && { category: code }) })}`;
  const current = CATEGORIES.find((c) => c.code === category);

  return (
    <Layout>
      <div className={`page ${css.layout}`}>
        <aside className={css.sidebar}>
          <nav className={`card ${css.menu}`} aria-label="Danh mục sản phẩm">
            <h2 className={css.menuTitle}>Danh mục sản phẩm</h2>
            <ul>
              {CATEGORIES.map((c) => (
                <li>
                  <a href={href(c.code)} aria-current={c.code === category ? "page" : undefined}>
                    <Icon name={c.icon} />
                    <span className={css.label}>{c.label}</span>
                    <span className={css.count}>{count(c.code)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className={css.content}>
          {!keyword && !category && (
            <section className={css.hero}>
              <h1>Linh kiện máy tính chính hãng</h1>
              <p>SSD, RAM, VGA, CPU và phụ kiện cho máy bàn, laptop. Giá niêm yết rõ ràng, bảo hành theo hãng.</p>
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
            <h2>{keyword ? `Kết quả cho “${keyword}”` : (current?.label ?? "Tất cả sản phẩm")}</h2>
            <span className="muted">{products.length} sản phẩm</span>
          </div>

          {products.length ? (
            <div className={css.grid}>
              {products.map((p) => (
                <ProductCard product={p} />
              ))}
            </div>
          ) : (
            <div className={`card ${css.empty}`}>
              <h3>Không tìm thấy sản phẩm phù hợp</h3>
              <p className="muted">Thử từ khoá khác, ví dụ “SSD” hoặc “Samsung”.</p>
              <a href="/" className="btn btn-outline">
                Xem tất cả sản phẩm
              </a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
