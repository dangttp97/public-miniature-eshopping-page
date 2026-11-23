import { Icon } from "@/components/Icon";
import { Layout } from "@/components/Layout";
import { Availability, Prices } from "@/components/ProductCard";
import { getProduct } from "@/utils/api";
import { thumb } from "@/utils/format";
import { back, navigate } from "@/utils/router";
import { addToCart, MAX_QTY } from "@/utils/store";

import css from "./Product.module.css";

const SPEC_LABELS: Record<string, string> = {
  capacity: "Dung lượng",
  formFactor: "Kích thước",
  interface: "Giao tiếp",
  readSpeed: "Tốc độ đọc",
  writeSpeed: "Tốc độ ghi",
  memoryType: "Loại RAM",
  speed: "Bus",
  latency: "Độ trễ",
  voltage: "Điện áp",
  material: "Chất liệu",
  model: "Model",
  transferRate: "Tốc độ truyền",
  dimensions: "Kích thước",
  cores: "Số nhân",
  threads: "Số luồng",
  maxClock: "Xung nhịp tối đa",
  cache: "Bộ nhớ đệm",
  socket: "Socket",
  integratedGraphics: "Đồ hoạ tích hợp",
  coolerIncluded: "Kèm tản nhiệt",
  chipset: "Chipset",
  cudaCores: "Nhân CUDA",
  memory: "Bộ nhớ",
  recommendedPsu: "Nguồn đề nghị",
  wattage: "Công suất",
  efficiency: "Hiệu suất",
  fanSize: "Quạt",
  inputVoltage: "Điện áp vào",
  motherboardSupport: "Hỗ trợ mainboard",
  includedFans: "Quạt kèm theo",
  warranty: "Bảo hành",
};

export const ProductPage = async ({ params }: { params: Record<string, string> }) => {
  const product = await getProduct(params.id);
  if (!product) {
    return (
      <Layout>
        <div className="page">
          <h1>Không tìm thấy sản phẩm</h1>
          <a href="/" className="btn btn-outline">
            Về trang chủ
          </a>
        </div>
      </Layout>
    );
  }

  const inStock = product.availability === "in_stock";
  const onAdd = (e: SubmitEvent) => {
    e.preventDefault();
    addToCart(product.id, Number(new FormData(e.currentTarget as HTMLFormElement).get("qty")));
    navigate("/cart");
  };

  return (
    <Layout>
      <div className="page">
        <div>
          <button className="btn btn-ghost" onClick={() => back()}>
            <Icon name="back" /> Quay lại
          </button>
        </div>

        <div className={css.layout}>
          <figure className={`card ${css.media}`}>
            <img src={thumb(product.imageUrl, 960)} alt={`Ảnh minh hoạ ${product.category}`} width="960" height="720" />
            <figcaption className={css.credit}>
              Ảnh minh hoạ, không phải ảnh đúng model ·{" "}
              <a href={product.imageAttribution.sourceUrl} target="_blank" rel="noopener">
                {product.imageAttribution.creator}, {product.imageAttribution.license}
              </a>
            </figcaption>
          </figure>

          <div className={css.info}>
            <h1>{product.name}</h1>
            <div className={css.meta}>
              <Availability product={product} />
              <span>SKU: {product.sku}</span>
              <span>Danh mục: {product.category}</span>
            </div>
            <Prices product={product} />
            {product.salesNote && <p className={css.note}>{product.salesNote}</p>}

            <form className={css.buy} onSubmit={onAdd}>
              <div className={`field ${css.qty}`}>
                <label htmlFor="qty">Số lượng</label>
                <input id="qty" name="qty" type="number" className="input" min="1" max={MAX_QTY} value="1" required disabled={!inStock} />
              </div>
              <button className="btn btn-primary" disabled={!inStock}>
                <Icon name="cart" /> {inStock ? "Thêm vào giỏ" : "Tạm hết hàng"}
              </button>
            </form>

            <section className="card">
              <table className={css.specs}>
                <caption className="visually-hidden">Thông số kỹ thuật</caption>
                <tbody>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <tr>
                      <th scope="row">{SPEC_LABELS[key] ?? key}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <a href={product.sourceUrl} target="_blank" rel="noopener" className={css.source}>
              Xem nguồn tham khảo giá
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};
