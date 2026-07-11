# Quy tắc làm việc cho project ReviewBooks (BTL Web & Mobile)

## 1. Mục tiêu

BTL cuối kỳ môn Lập trình Web và ứng dụng di động. Đề tài: **ReviewBooks** — website đánh giá sách + mobile app tương ứng. Yêu cầu chi tiết và thang điểm nằm ở `Yeu cau BTL.pdf`.

Mục tiêu điểm: **10/10**. Hai điều kiện bắt buộc để đạt được:

1. Toàn bộ code chỉ dùng kiến thức có trong `slide/website` và `slide/mobile`. Không dùng kỹ thuật/thư viện/pattern nằm ngoài slide.
2. Code đơn giản nhất có thể, dễ đọc, dễ bảo trì, và **người viết (Mao) phải giải thích được từng dòng khi giáo viên hỏi**.

Không tối ưu, không thêm tính năng ngoài rubric, không "làm cho ngầu" — chỉ làm đúng và đủ yêu cầu bằng cách đơn giản nhất.

## 2. Nguyên tắc phạm vi kiến thức (quan trọng nhất)

- Trước khi dùng bất kỳ kỹ thuật, thư viện hay pattern nào: kiểm tra nó có được dạy trong slide không. Nếu không chắc, mở PDF slide liên quan để xác nhận trước khi viết code.
- Nếu kỹ thuật cần dùng không có trong slide → tìm cách làm đơn giản hơn, đã có trong slide, để thay thế. Không tự sáng tạo giải pháp "hiện đại hơn" nếu giáo viên không dạy.
- **Không dùng** (trừ khi slide có dạy rõ): ORM (Sequelize/Prisma/TypeORM), CSS framework (Bootstrap/Tailwind), JS framework cho website (React/Vue/Angular), UI kit có sẵn cho mobile (NativeBase, react-native-paper, react-native-elements...), testing framework, Docker, CI/CD, GraphQL, WebSocket, JWT/OAuth phức tạp.
- Rubric trừ **-10 điểm** cho "Copy hoặc dùng thư viện sẵn" (cả web và mobile). Hiểu là: không copy code mẫu/template trên mạng, không dùng UI kit hoặc giao diện dựng sẵn. Chỉ dùng các package nền tảng tối thiểu, tự viết toàn bộ logic và giao diện.
- **Ngoại lệ TypeScript (chỉ mobile):** mobile app dùng TypeScript dù slide `slide/mobile` không dạy, vì bắt buộc dùng template Expo `blank-typescript` (xem mục 3). Đây là ngoại lệ có chủ đích, không phải lỗ hổng phạm vi — Mao phải tự tin giải thích được cú pháp TS xuất hiện trong code (type annotation cơ bản, interface/type cho props và state) khi giáo viên hỏi. Không dùng type phức tạp (generic nâng cao, decorator...) — chỉ dùng mức tối thiểu để component chạy được. Website vẫn giữ nguyên quy tắc không TypeScript.

### 2.1 Rà soát từng slide (đã đọc nội dung thật của cả 20 file)

**Không có kiến thức lập trình cần thiết (bỏ qua, không cần đọc kỹ):**

| Slide | Lý do |
|---|---|
| website `01. Introduction to Web Development` | Chỉ lịch sử/định nghĩa, không có code |
| website `JavaScript.pdf` | Chỉ là outline + 2 link, không dạy cú pháp thật |
| mobile `01. Introduction` | Chỉ tổng quan native/hybrid/cross-platform, không có code RN |

**Có kiến thức lập trình thật, nhưng project này không dùng tới (không cần học sâu, không được dùng trong code):**

| Slide | Lý do không dùng |
|---|---|
| mobile `02. ReactJS` | Code JSX/class component là cho web React, không phải React Native |
| mobile `06. Animations` | Rubric không yêu cầu animation |
| mobile `07. Gestures` | Rubric không yêu cầu gesture/drag tuỳ chỉnh |
| mobile `09. Graphics` | Rubric không yêu cầu canvas/vẽ đồ hoạ |
| mobile `12. Reducer, Redux` | Đã chọn Context/useState thay Redux (Context nằm ở slide `05. Hooks`, không mất kiến thức khi bỏ slide này) |
| mobile `13. Camera` | Đã loại khỏi scope; còn cần bare RN CLI, không tương thích Expo |
| mobile `14. Location-based Services` | Đã loại khỏi scope (không dùng Location) |
| mobile `11. Networking` (chỉ phần JWT/token auth) | Phần `fetch`/REST vẫn cần dùng; phần JWT dạy sâu nhưng project chọn cách đơn giản hơn (AsyncStorage) |

**Cần dùng — nền tảng chính, đọc kỹ:**

- website: `02. HTML Language`, `03. CSS`, `04. Client-Side Programming`, `05. Server-Side Development`
- mobile: `03. React Native`, `04. Styling, Layout`, `05. Hooks`, `08. Navigation` (phần Stack/Tab; phần Drawer khả năng không dùng), `10. Data Storage`, `11. Networking` (phần `fetch`)

Khi viết code, chỉ tra cứu cú pháp trong nhóm "cần dùng" ở trên. Nếu cần một kỹ thuật nằm trong nhóm "không dùng tới" (ví dụ Redux, Camera), coi đó là dấu hiệu tính năng đang vượt phạm vi rubric — quay lại kiểm tra mục 4 (checklist rubric) trước khi viết.

## 3. Stack đã chốt

### Website — đã code phần lớn (xem `website/README.md` để biết chi tiết tính năng hiện có)

- Express + EJS + MySQL (`mysql2`) + `express-session` + `dotenv`.
- Không Bootstrap/Tailwind/jQuery/React (đã ghi rõ trong `website/README.md` mục "Không dùng").
- Cấu trúc đang dùng, giữ nguyên khi thêm tính năng mới: `routes/` (định tuyến) · `middleware/` (auth, admin-only, flash, view counter...) · `views/` (EJS, chia `pages/` và `admin/`) · `utils/` (validation, password, pagination) · `config/db.js` · `sql/database.sql` · `public/` (css/js/images thuần).

### Mobile — chưa bắt đầu

- **Bắt buộc dùng Expo CLI**, khởi tạo bằng đúng lệnh:
  ```
  npx create-expo-app@latest my-app --template blank-typescript
  ```
  Tên app (`my-app`) có thể đổi tuỳ ý. Deploy/demo bằng cách quét QR chạy trên điện thoại qua app **Expo Go** — không build APK/IPA, không dùng EAS Build (ngoài phạm vi, không cần thiết cho demo).
- Template `blank-typescript` → mobile viết bằng TypeScript (`.tsx`), là ngoại lệ đã ghi ở mục 2. Chỉ dùng type annotation cơ bản, không dùng tính năng TS phức tạp.
- React Navigation (slide `08. Navigation`) + Hooks `useState`/`useEffect` (slide `05. Hooks`) + `fetch` (slide `11. Networking`) để gọi API của website.
- State: dùng `useState`/Context đơn giản. **Không dùng Redux/Reducer** (slide `12` có dạy nhưng app chỉ có 5 màn hình, state đơn giản — thêm Redux là phức tạp hoá không cần thiết, khó bảo vệ).
- **Không dùng** Camera, Location — rubric mobile không yêu cầu các mục này; thêm vào chỉ tạo rủi ro và code dư không giải thích được.
- **Không có màn hình/chức năng admin trên mobile** — rubric mobile chỉ liệt kê 4 nhóm màn hình cho người dùng thường, không yêu cầu quản trị. Admin vẫn chỉ quản lý qua website.
- Lưu trạng thái đăng nhập bằng `AsyncStorage` (slide `10. Data Storage`).
- Điện thoại demo (chạy Expo Go) và máy chạy server Express phải cùng mạng Wi-Fi; API base URL trong mobile app dùng địa chỉ IP LAN của máy chạy server (không dùng `localhost`).
- Vị trí project: tạo folder `mobile/` ngang hàng với `website/` (tại gốc `ReviewBooks/`). `.gitignore` riêng cho mobile: `node_modules/`, `.expo/`, `*.log`.
- IP/base URL của API: không dùng `dotenv` (template `blank-typescript` không có sẵn, thêm vào là thừa/ngoài phạm vi cho mobile) — dùng 1 file hằng số đơn giản, ví dụ `src/config.ts`:
  ```ts
  export const API_BASE_URL = "http://<IP_LAN_may_chay_server>:3000/api";
  ```
  Sửa tay giá trị này theo mạng lúc demo.

#### 5 màn hình mobile (khớp đúng 4 nhóm yêu cầu trong rubric)

| # | Màn hình | Yêu cầu rubric tương ứng | Nội dung chính |
|---|---|---|---|
| 1 | Home | Màn hình chính | Giới thiệu app, nút vào Danh sách sách / Liên hệ / Đăng nhập (hoặc hiện tên user + nút đăng xuất nếu đã đăng nhập) |
| 2 | Login | Màn hình đăng nhập | Form username/password, gọi API login, lưu user vào `AsyncStorage` |
| 3 | Book List | Màn hình hiển thị nội dung (phần danh sách) | Danh sách sách lấy từ API, bấm vào 1 sách để sang Book Detail |
| 4 | Book Detail | Màn hình hiển thị nội dung (phần chi tiết + bình luận, đánh giá) | Chi tiết sách + danh sách bình luận hiện có + form gửi bình luận/đánh giá (chỉ hiện form khi đã đăng nhập, giống rule `requireLogin` bên web) |
| 5 | Contact | Màn hình ý kiến và liên hệ | Form gửi ý kiến (tên, email, nội dung) giống trang `/contact` bên web |

- Điều hướng: dùng **1 Stack Navigator duy nhất** chứa cả 5 màn hình (không kết hợp thêm Tab Navigator) — đủ đơn giản để giải thích, các màn hình điều hướng qua nhau bằng nút bấm thường (giống link trên web).
- Cấu trúc folder mobile, giữ tinh thần rõ vai trò như bên website:
  ```
  mobile/
    App.tsx                  (khai báo Stack Navigator, danh sách screen)
    src/
      screens/                (HomeScreen.tsx, LoginScreen.tsx, BookListScreen.tsx, BookDetailScreen.tsx, ContactScreen.tsx)
      api/                    (client.ts — các hàm fetch gọi từng endpoint)
      contexts/               (AuthContext.tsx — lưu user hiện tại bằng useState/useContext + đọc/ghi AsyncStorage)
      config.ts               (hằng số API_BASE_URL)
  ```

### API nối web ↔ mobile

- Thêm route JSON riêng cho mobile (ví dụ `routes/apiRoutes.js`), **không sửa** route EJS hiện có. Tái dùng lại các hàm/query đã có trong `config/db.js`, `utils/`.
- Auth cho mobile: đơn giản nhất có thể — endpoint login trả về thông tin user, mobile lưu vào `AsyncStorage` và gửi lại khi cần (không cần JWT nếu slide không dạy).
- Bình luận/đánh giá từ mobile bắt buộc đăng nhập trước, giống website (`requireLogin` middleware) — name/email của bình luận lấy từ user đã đăng nhập, **không** cho nhập tay tên/email (đúng như logic hiện có ở `routes/publicRoutes.js`).
- Format response JSON thống nhất cho mọi endpoint: `{ success: boolean, data?: ..., message?: string }` — đơn giản, dễ giải thích, mobile chỉ cần kiểm tra `success` trước khi dùng `data`.
- Danh sách endpoint dự kiến trong `routes/apiRoutes.js`:

| Method & path | Dùng cho màn hình | Trả về |
|---|---|---|
| `POST /api/login` | Login | `{ success, data: { id, username, role } }` hoặc `{ success: false, message }` |
| `GET /api/books` | Book List | `{ success, data: [ { id, title, category, average_rating, ... } ] }` |
| `GET /api/books/:id` | Book Detail | `{ success, data: { ...book, comments: [ ... ] } }` |
| `POST /api/books/:id/comments` | Book Detail (form bình luận) | `{ success, data: newComment }` — yêu cầu đăng nhập, dùng lại `validateComment` từ `utils/validation.js` |
| `POST /api/contact` | Contact | `{ success }` — dùng lại logic của route `/contact` hiện có |

- Tài khoản dùng để test luồng mobile ↔ web: dùng lại tài khoản mẫu có sẵn trong `sql/database.sql` (`reader` / `user123`) để test login + gửi bình luận. Không cần test tài khoản admin trên mobile vì mobile không có chức năng admin.

### Thiết kế & nội dung đồng bộ web ↔ mobile

- **Nội dung**: mobile luôn lấy dữ liệu qua API, không tự tạo/copy nội dung riêng — tên sách, category, số đánh giá, nội dung bình luận phải khớp 100% với dữ liệu website đang hiển thị (cùng 1 database).
- **Màu sắc** dùng lại đúng bảng màu hiện có ở `website/public/css/style.css` (`:root`) để đồng bộ thương hiệu, dễ giải thích ở mục "thiết kế giao diện":
  - `paper #f7f1e7` (nền chính), `ink #1d211b` (chữ chính), `accent #a65f2b` (nút/nhấn chính), `sage #8fa184` (phụ/thành công), `danger #f2d8d1` (lỗi).
- **Font**: dùng font hệ điều hành mặc định của React Native (không tải font ngoài — tránh thêm dependency không cần thiết); tinh thần giống `Segoe UI` bên web là đủ, không cần khớp tuyệt đối.
- **Bố cục**: giữ tinh thần giống web (thẻ sách dạng card, nút chính dùng màu accent, bo góc nhẹ) nhưng chuyển đổi tự nhiên sang thành phần RN (`View`/`Text`/`Image`/`FlatList`) — không copy y nguyên CSS, chỉ giữ cảm giác thiết kế nhất quán.

## 4. Checklist rubric (bám sát để không thiếu, không thừa)

### Website

| Yêu cầu | Trạng thái |
|---|---|
| Lưu dữ liệu bằng database | Đã có (`sql/database.sql`) |
| Đăng nhập/đăng xuất, phân biệt admin/user | Đã có |
| Trang hiển thị nội dung theo mã (sách theo id) | Đã có |
| Form bình luận + đánh giá (tên, email, nội dung, điểm) | Đã có |
| Bình luận/đánh giá hiển thị công khai | Đã có |
| Popup quảng cáo sau 1 phút ở trang chủ | Đã có |
| Cookie để không hiện lại popup sau khi đóng | Đã có |
| Trang giới thiệu + liên hệ | Đã có |
| Form gửi ý kiến liên hệ | Đã có |
| Admin: hiển thị tổng số view | Đã có |
| Admin: cập nhật nội dung các trang | Đã có |
| Admin: xem/xoá bình luận | Đã có |
| Responsive 3 ngưỡng (800px, 1200px) | Đã có |
| Thiết kế giao diện | Đã có, cần rà lại trước khi bảo vệ |
| Tổ chức project | Đã có |
| Không copy / không dùng thư viện sẵn | Cần rà lại toàn bộ trước khi nộp |

### Mobile — toàn bộ chưa làm

| Yêu cầu | Trạng thái |
|---|---|
| Giao tiếp với website bằng API | Chưa làm |
| Màn hình chính | Chưa làm |
| Màn hình đăng nhập | Chưa làm |
| Màn hình hiển thị nội dung (+ bình luận, đánh giá) | Chưa làm |
| Màn hình ý kiến và liên hệ | Chưa làm |
| Thiết kế giao diện | Chưa làm |
| Tổ chức project | Chưa làm |
| Không copy / không dùng thư viện sẵn | Cần đảm bảo từ đầu |

## 5. Quy tắc code

- **Ngôn ngữ hiển thị (UI) phải 100% tiếng Việt** — mọi text người dùng nhìn thấy: label, nút, placeholder, thông báo lỗi/thành công, tiêu đề trang, nội dung tĩnh (cả web EJS và mobile RN). Code (tên biến, hàm, file, comment nội bộ) và URL/route/API path vẫn dùng tiếng Anh như hiện tại — không cần dịch.
- Function ngắn, tên rõ nghĩa, tách theo đúng vai trò (route / middleware / view / util cho web; screen / navigation / api cho mobile) — giữ đúng cấu trúc đã có.
- Comment tại các đoạn ánh xạ trực tiếp tới 1 dòng trong rubric, ví dụ: `// Popup quảng cáo sau 60s + cookie khi đóng (yêu cầu: trang chủ popup)`.
- Không viết code rút gọn khó đọc, không dùng pattern/abstraction chưa cần tới (KISS). Ưu tiên rõ ràng hơn ngắn gọn.
- Nếu một đoạn code không tự giải thích được bằng kiến thức trong slide, không dùng đoạn đó — tìm cách viết lại đơn giản hơn.

## 6. Trước khi coi một phần là "xong"

1. Đối chiếu lại với dòng tương ứng trong `Yeu cau BTL.pdf`.
2. Đối chiếu kỹ thuật đã dùng với slide liên quan — không có gì ngoài phạm vi.
3. Chạy thử thật (không chỉ đọc code) để xác nhận hoạt động đúng.
4. Tự hỏi: "Nếu giáo viên hỏi tại sao code như vậy, có trả lời được không?" Nếu không, đơn giản hoá lại.
