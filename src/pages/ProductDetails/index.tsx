import { getProduct } from "@/api/products";
import { Button } from "@/components/Button/Button";
import { Carousel } from "@/components/Carousel/Carousel";
import { Icon } from "@/components/Icon/Icon";
import { NotFound } from "@/components/NotFound/NotFound";
import { PageStatus } from "@/components/PageStatus/PageStatus";
import { useBack } from "@/lib/navigation";
import { useAsync } from "@/lib/useAsync";
import type { Page } from "@koniwa/router";

import { AddToCartForm } from "./AddToCartForm";
import css from "./ProductDetails.module.css";
import { ProductSummary } from "./ProductSummary";
import { SpecsTable } from "./SpecsTable";

export const ProductDetails: Page = ({ params }) => {
  const back = useBack();
  const found = useAsync(() => getProduct(params.id), [params.id]);
  if (found.status !== "done") return <PageStatus state={found} />;

  const product = found.data;
  if (!product) return <NotFound title="Không tìm thấy sản phẩm" />;

  return (
    <div className="page">
      <div>
        <Button variant="ghost" onClick={() => back()}>
          <Icon name="back" /> Quay lại
        </Button>
      </div>

      <div className={css.layout}>
        <Carousel images={product.images} alt={product.name} />

        <div className={css.info}>
          <ProductSummary product={product} />
          <AddToCartForm product={product} />
          <SpecsTable specs={product.specs} />
          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noopener"
            className={css.source}
          >
            Xem nguồn tham khảo giá
          </a>
        </div>
      </div>
    </div>
  );
};
