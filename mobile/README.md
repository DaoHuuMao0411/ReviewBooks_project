# ReviewBooks Mobile

Ứng dụng di động của ReviewBooks — Bài tập lớn môn Lập trình Web và Ứng dụng Di động. Xây dựng bằng Expo (React Native + TypeScript), gọi API từ server Express của `website/` — không có backend hay dữ liệu riêng.

## 1. Cài đặt và chạy

### Bước 1: Chuẩn bị môi trường
- Node.js >= 18.
- Điện thoại cài app **Expo Go** (App Store / Google Play).
- Điện thoại và máy tính chạy server **cùng một mạng Wi-Fi**.
- Server `website/` đang chạy (`npm start` trong `website/`, xem `website/README.md`).

### Bước 2: Cấu hình địa chỉ IP server
Sửa `src/config.ts`, thay bằng địa chỉ IP LAN thật của máy đang chạy server (không dùng `localhost` vì điện thoại là thiết bị khác):
```ts
export const API_BASE_URL = 'http://<IP_LAN_may_chay_server>:3000/api';
```
Tìm IP LAN: Windows → Settings → Network & internet → Wi-Fi → (tên mạng đang kết nối) → Properties → mục IPv4 address.

### Bước 3: Cài đặt & chạy
```bash
npm install
npm start
```
Quét mã QR hiện ra bằng app Expo Go trên điện thoại để mở app.

> Nếu điện thoại báo "Không thể kết nối tới máy chủ": kiểm tra lại IP ở Bước 2, đảm bảo server `website/` đang chạy, và mạng Wi-Fi trên máy tính đang ở chế độ **Private** (không phải Public) để Windows Firewall không chặn kết nối đến từ điện thoại.

### Tài khoản mẫu (dùng chung dữ liệu với website)
- User: `reader` / `user123`

## 2. Kiến trúc dự án

```
App.tsx                  Khai báo Stack Navigator, danh sách 5 màn hình
index.ts                 Entry point (registerRootComponent)
src/
  config.ts              Hằng số API_BASE_URL
  theme.ts                Bảng màu lấy từ website/public/css (đồng bộ giao diện)
  api/
    client.ts             Các hàm fetch gọi từng endpoint /api/*
    types.ts               Type dùng chung, khớp dữ liệu trả về từ server
  contexts/
    AuthContext.tsx        Lưu user hiện tại (useState/useContext) + đọc/ghi AsyncStorage
  screens/
    HomeScreen.tsx          Màn hình chính
    LoginScreen.tsx         Màn hình đăng nhập
    BookListScreen.tsx      Danh sách sách (kèm tìm kiếm)
    BookDetailScreen.tsx    Chi tiết sách + bình luận/đánh giá
    ContactScreen.tsx       Ý kiến và liên hệ
```

Điều hướng: 1 Stack Navigator duy nhất chứa cả 5 màn hình (không kết hợp Tab Navigator), chuyển màn hình bằng nút bấm thường.

## 3. Đối chiếu yêu cầu BTL (Mobile)

| Yêu cầu | Trạng thái | Ghi chú |
| --- | --- | --- |
| Giao tiếp với website bằng API | ✅ | `src/api/client.ts` gọi `/api/*` của server Express |
| Màn hình chính | ✅ | `HomeScreen` |
| Màn hình đăng nhập | ✅ | `LoginScreen`, lưu user vào AsyncStorage |
| Màn hình hiển thị nội dung (danh sách + chi tiết) | ✅ | `BookListScreen`, `BookDetailScreen` |
| Bình luận, đánh giá | ✅ | Trong `BookDetailScreen`, bắt buộc đăng nhập giống web |
| Màn hình ý kiến và liên hệ | ✅ | `ContactScreen` |
| Thiết kế giao diện đồng bộ web | ✅ | Dùng chung bảng màu `src/theme.ts` |
| Không dùng thư viện/UI kit dựng sẵn | ✅ | Chỉ dùng `View`/`Text`/`TextInput`/`FlatList`... của React Native gốc |

## 4. Những gì mobile KHÔNG làm (có chủ đích)

- Không có màn hình/chức năng quản trị (admin) — rubric mobile không yêu cầu, admin chỉ quản lý qua website.
- Không có popup quảng cáo + cookie — chỉ là yêu cầu riêng của trang chủ website.
- Không dùng Redux (dùng Context/useState vì app chỉ có 5 màn hình, state đơn giản).
- Không dùng JWT — đăng nhập lưu thông tin user vào AsyncStorage, gọi lại session cookie của server khi cần (giống cách web quản lý session).

## 5. Dependencies

```
@react-native-async-storage/async-storage   Lưu user đăng nhập (slide 10. Data Storage)
@react-navigation/native, @react-navigation/stack   Stack Navigator (slide 08. Navigation)
react-native-gesture-handler, react-native-safe-area-context, react-native-screens   Peer dependency bắt buộc của react-navigation/stack
expo, expo-status-bar, react, react-native   Nền tảng Expo (template blank-typescript)
```
Không có dependency ngoài phạm vi slide (không UI kit, không Redux, không testing framework).
