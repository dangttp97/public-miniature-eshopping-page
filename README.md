# public-miniature-eshopping-page

## Mô tả dự án

Dự án mẫu cho trang bán hàng điện tử và linh kiện máy tính. WireMock cung cấp
dữ liệu sản phẩm giả lập để phục vụ việc phát triển và thử nghiệm giao diện.
Danh mục hiện có 13 sản phẩm thuộc các nhóm SSD, RAM, USB, ổ cứng di động,
CPU, VGA, nguồn và case; tất cả sản phẩm có URL ảnh minh họa từ Wikimedia
Commons. Ảnh không đại diện chính xác cho model đang liệt kê.

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

### Nguồn và giấy phép ảnh minh họa

Ảnh được liên kết trực tiếp từ Wikimedia Commons; không dùng ảnh sản phẩm
MemoryZone. Ảnh chỉ minh họa loại linh kiện, không phải ảnh đúng model. Các
record chứa `imageUrl`, `imageIsIllustrative` và `imageAttribution`:

- SSD SATA: [Silicon Power 60GB](https://commons.wikimedia.org/wiki/File:2015_Dysk_SSD_Silicon_Power_60GB_(02).jpg),
  Jacek Halicki, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- SSD M.2: [Plextor M8Pe(Y) 256GB](https://commons.wikimedia.org/wiki/File:2017_Dysk_SSD_Plextor_M8Pe(Y)_256GB.jpg),
  Jacek Halicki, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- RAM: [DDR4 RAM](https://commons.wikimedia.org/wiki/File:16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png),
  PantheraLeo1359531, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- USB: [Verbatim Store 'n' Click 16GB](https://commons.wikimedia.org/wiki/File:2023_Pendrive%27y_Verbatim_Store_%E2%80%98n%E2%80%99_Click_16_GB_(1).jpg),
  Jacek Halicki, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- Ổ cứng di động: [Silicon Power Stream S03](https://commons.wikimedia.org/wiki/File:HK_unboxing_Made_in_Taiwan_USB_3.1_Gen_1_Portable_Hard_Drive_Stream_S03_%E5%BB%A3%E7%A9%8E%E9%9B%BB%E9%80%9A_Silicon_Power_Computer_%26_Communications_April_2019_SSG_01.jpg),
  PS Ommyerb, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- CPU: [Ảnh mặt dưới AMD Ryzen Threadripper 7970X](https://commons.wikimedia.org/wiki/File:Unterseite_des_AMD_Ryzen_Threadripper_7970X_20240407_074.jpg),
  PantheraLeo1359531, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- VGA: [BFG NVIDIA GeForce 9500 GT](https://commons.wikimedia.org/wiki/File:BFG_NVIDIA_GeForce_9500_GT.jpg),
  Thomas Galvin, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- PSU: [ATX Computer power supply unit](https://commons.wikimedia.org/wiki/File:ATX_Computer_power_supply_unit.jpg),
  Dmitry Makeev, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- Case: [Kolink Observatory RGB Midi-Tower](https://commons.wikimedia.org/wiki/File:PC-Geh%C3%A4use_Kolink_Observatory_RGB_Midi-Tower_20201120_DSC6134.jpg),
  PantheraLeo1359531, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
