# public-miniature-eshopping-page

## Mô tả dự án

Dự án mẫu cho trang bán hàng điện tử và linh kiện máy tính. WireMock cung cấp
dữ liệu sản phẩm giả lập để phục vụ việc phát triển và thử nghiệm giao diện.
Danh mục hiện có 13 sản phẩm thuộc các nhóm SSD, RAM, USB, ổ cứng di động,
CPU, VGA, nguồn và case; ảnh sản phẩm lấy từ trang MemoryZone tương ứng và
lưu trong `public/images/`.

## Công nghệ sử dụng

- **JSX Lite Renderer**: thư viện kết xuất giao diện JSX.
- **Yarn 4.18**: quản lý gói và phụ thuộc.
- **WireMock**: giả lập API sản phẩm.
- **JSON**: định nghĩa mapping và dữ liệu phản hồi của WireMock.
- **Docker**: môi trường chạy WireMock.
- **Shell**: ngôn ngữ của script trong thư mục `scripts`.

## Dữ liệu mẫu

Catalog được trả về tại `GET http://localhost:8080/api/products`.

## Chạy thử

Mở hai terminal: `yarn mock` chạy WireMock ở cổng 8080 (lần đầu tự tải jar extension),
`yarn dev` chạy Vite và proxy `/api` sang WireMock.

WireMock dùng [wiremock-state-extension](https://github.com/wiremock/wiremock-state-extension)
để giữ dữ liệu giữa các request: tài khoản đăng ký, phiên đăng nhập và đơn hàng tồn tại
cho tới khi tắt container (tối đa 24 giờ).

Tài khoản có sẵn: `an@example.vn` / `matkhau123`, `binh@example.vn` / `123456`.

| Endpoint | Mô tả |
|---|---|
| `GET /api/products?keyword=` | Danh sách, tìm theo tên |
| `GET /api/products/:id` | Chi tiết, `404` nếu không có |
| `POST /api/auth/check` | `{ exists }` theo email |
| `POST /api/auth/register` | `201 { user, token }`; `409` email trùng; `400` mật khẩu dưới 6 ký tự |
| `POST /api/auth/login` | `200 { user, token }`; `401` sai email hoặc mật khẩu |
| `GET /api/auth/me` | User theo `Authorization: Bearer <token>`; `401` nếu phiên không hợp lệ |
| `POST /api/auth/logout` | Huỷ phiên hiện tại |
| `POST /api/orders` | `201` đơn mới (khách hoặc đã đăng nhập); `409` hết hàng; `422` sản phẩm không tồn tại |
| `GET /api/orders` | Đơn của tài khoản đang đăng nhập, mới nhất trước; `401` nếu chưa đăng nhập |
| `GET /api/orders/:id` | Chi tiết đơn, `404` nếu không có |

Tên sản phẩm, SKU, thông số và tình trạng được tham khảo từ các trang
MemoryZone công khai vào ngày 21/11/2026. Giá được làm tròn lên bậc 10.000đ.
Đây là dữ liệu minh họa, không phải catalog hoặc báo giá hiện hành; giá và
tình trạng sản phẩm có thể thay đổi. CPU và VGA được nguồn ghi còn hàng nhưng
chỉ bán kèm PC lắp ráp tối thiểu 7 linh kiện; các record vẫn là linh kiện riêng,
không có PC build sẵn. Các sản phẩm còn lại trong snapshot được nguồn đánh dấu
hết hàng. Mỗi record lưu `sourceUrl` và `priceCheckedAt`; `priceVnd` là giá
được làm tròn lên từ giá tại trang nguồn, còn `originalPriceVnd` là giá tham
chiếu hiển thị tại nguồn.

- [SSD Western Digital Green 240GB](https://memoryzone.com.vn/ssd-western-digital-green-sata-iii-240gb)
- [RAM Crucial DDR4 8GB](https://memoryzone.com.vn/ram-laptop-crucial-ddr4-8gb-bus-2400-skylake-kabylake)
- [USB Kingston DataTraveler 100 G3 32GB](https://memoryzone.com.vn/usb-3-0-kingston-datatraverler-100-g3-32gb-100mb-s)
- [USB SanDisk Ultra Flair CZ73 128GB](https://memoryzone.com.vn/usb-3-0-sandisk-ultra-flair-cz73-128gb)
- [SSD ADATA XPG Gammix S50 2TB](https://memoryzone.com.vn/ssd-adata-xpg-gammix-s50-m-2-pcie-gen4-x4-nvme-2tb-agammixs50-2tt-c)
- [RAM Corsair Vengeance LPX 8GB](https://memoryzone.com.vn/ram-pc-corsair-vengeance-lpx-8gb-bus-2400-ddr4-c14-cmk8gx4m1a2400c14)
- [USB Samsung BAR-FIT 32GB](https://memoryzone.com.vn/usb-3-0-samsung-bar-fit-32gb)
- [USB Samsung BAR-FIT 64GB](https://memoryzone.com.vn/usb-3-0-samsung-bar-fit-64gb)
- [Ổ cứng di động Transcend StoreJet 25M3 1TB](https://memoryzone.com.vn/o-cung-di-dong-transcend-storejet-25m3-2-5-1tb)
- [CPU Intel Core i5-14400 Tray](https://memoryzone.com.vn/cpu-intel-core-i5-14400-up-to-4-7ghz-10-cores-16-threads-20mb-tray-new)
- [VGA MSI GeForce RTX 5060 VENTUS 2X OC V1](https://memoryzone.com.vn/vga-msi-geforce-rtx-5060-ventus-2x-oc-v1-8gb-gddr7)
- [Nguồn Corsair CV650](https://memoryzone.com.vn/nguon-may-tinh-corsair-cv650-650w-80-plus-bronze-cp-9020236-na)
- [Case Deepcool MATREXX 40 3FS](https://memoryzone.com.vn/case-may-tinh-deepcool-matrexx-40-3fs-dp-matx-matrexx40-3fs)

### Nguồn ảnh sản phẩm

Ảnh trong `public/images/<id>/<n>.webp` là toàn bộ gallery của trang sản phẩm
MemoryZone liệt kê ở trên (lấy từ `<link sản phẩm>.json`, trường `images`), tải
ngày 24/11/2026 và chuyển sang WebP rộng tối đa 600px. Mỗi sản phẩm có trường
`images` (ảnh đầu tiên là ảnh chính). Bản quyền ảnh
thuộc MemoryZone hoặc nhà sản xuất; dự án chỉ dùng cho mục đích học tập, phi
thương mại. Trang chi tiết sản phẩm có link về trang gốc.
