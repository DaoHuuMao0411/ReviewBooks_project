# ReviewBooks

Bài tập lớn môn Lập trình Web và Ứng dụng Di động — website đánh giá sách kèm mobile app tương ứng, dùng chung một database và một bộ API.

Yêu cầu chi tiết: [`Yeu cau BTL.pdf`](Yeu%20cau%20BTL.pdf). Quy tắc làm việc, phạm vi kiến thức cho phép, checklist rubric: [`CLAUDE.md`](CLAUDE.md).

## Cấu trúc project

```
website/    Website Express + EJS + MySQL (xem website/README.md)
mobile/     App di động Expo/React Native, gọi API của website (xem mobile/README.md)
slide/      Slide bài giảng - phạm vi kiến thức được phép dùng khi viết code
```

## Bắt đầu nhanh

Cả hai phần dùng chung 1 server và 1 database — luôn khởi động `website/` trước.

```bash
cd website
npm install
npm start        # http://localhost:3001
```

```bash
cd mobile
npm install
# sửa src/config.ts thành IP LAN thật của máy đang chạy website
npm start         # quét mã QR bằng app Expo Go
```

Điện thoại chạy Expo Go và máy chạy `website` phải cùng mạng Wi-Fi.

Chi tiết cài đặt, kiến trúc, đối chiếu rubric của từng phần: [`website/README.md`](website/README.md) và [`mobile/README.md`](mobile/README.md).

## Kiến trúc chung

- **Database**: MySQL, dùng chung cho cả web và mobile (`website/sql/database.sql`).
- **Backend**: chỉ một server Express (`website/`). Route EJS (`routes/web/`) phục vụ trình duyệt, route JSON (`routes/api/`, mount tại `/api`) phục vụ mobile app — cả hai gọi chung tầng `services/`, không lặp code.
- **Mobile**: không có backend/dữ liệu riêng, chỉ là client gọi `/api/*` của website qua `fetch`.
- **Đăng nhập**: dùng session cookie phía server cho cả web và mobile (không JWT).

## Tài khoản mẫu

- Admin (chỉ dùng trên website): `admin` / `admin123`
- User (dùng được cả web và mobile): `reader` / `user123`

## Nguyên tắc chung của project

Chỉ dùng kỹ thuật có trong slide, không dùng ORM/CSS framework/JS framework/UI kit dựng sẵn, code đơn giản và giải thích được từng dòng. Xem đầy đủ tại [`CLAUDE.md`](CLAUDE.md).
