import { Icon } from "@/components/Icon/Icon";
import type { Category } from "@/entities/Category";
import type { Product } from "@/entities/Product";
import { cx } from "@/lib/cx";
import { Link } from "@koniwa/router";

import css from "./SideBar.module.css";

type SideBarProps = {
  categories: Category[];
  products: Product[];
  keyword: string;
  category: string;
};

export const SideBar = ({
  categories,
  products,
  keyword,
  category,
}: SideBarProps) => {
  const countIn = (code: string) =>
    code ? products.filter((p) => p.category === code).length : products.length;
  const linkTo = (code: string) => {
    const query = new URLSearchParams({
      ...(keyword && { keyword }),
      ...(code && { category: code }),
    });
    return query.size ? `/?${query}` : "/";
  };

  return (
    <aside className={css.sidebar}>
      <nav className={cx("card", css.menu)} aria-label="Danh mục sản phẩm">
        <h2 className={css.menuTitle}>Danh mục sản phẩm</h2>
        <ul>
          {categories.map((c) => (
            <li key={c.code}>
              <Link
                to={linkTo(c.code)}
                aria-current={c.code === category ? "page" : undefined}
              >
                <Icon name={c.icon} />
                <span className={css.label}>{c.label}</span>
                <span className={css.count}>{countIn(c.code)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
