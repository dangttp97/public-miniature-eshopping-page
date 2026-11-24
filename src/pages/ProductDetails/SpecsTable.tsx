import type { Product } from "@/entities/Product";

import css from "./ProductDetails.module.css";

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

export const SpecsTable = ({ specs }: { specs: Product["specs"] }) => (
  <section className="card">
    <table className={css.specs}>
      <caption className="visually-hidden">Thông số kỹ thuật</caption>
      <tbody>
        {Object.entries(specs).map(([key, value]) => (
          <tr key={key}>
            <th scope="row">{SPEC_LABELS[key] ?? key}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);
