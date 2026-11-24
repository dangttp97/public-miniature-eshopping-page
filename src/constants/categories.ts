import type { Category } from "@/entities/Category";

export const CATEGORIES: Category[] = [
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
