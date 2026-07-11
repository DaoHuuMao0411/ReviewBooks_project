// Các type dùng chung cho toàn bộ app, khớp với dữ liệu trả về từ website/routes/api.

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Tag {
  id: number;
  name: string;
}

// Sách khi lấy từ danh sách (GET /api/books) có kèm average_rating/comment_count
// (tính sẵn ở server bằng JOIN + AVG/COUNT). Khi lấy 1 sách theo id
// (GET /api/books/:id) thì server KHÔNG kèm 2 trường này trong "book", mà trả
// riêng ở trường "rating" (xem hàm getBookDetail bên client.ts) - nên để 2 trường
// này là optional (?), tránh hiểu nhầm lúc nào cũng có.
export interface Book {
  id: number;
  title: string;
  author_id: number;
  cover_image: string;
  description: string;
  review_content: string;
  language: string | null;
  publish_year: number | null;
  page_count: number | null;
  publisher: string | null;
  translator: string | null;
  author: string;
  author_avatar: string;
  author_bio: string;
  // MySQL trả AVG()/ROUND() dạng chuỗi (không phải number) qua driver mysql2 -
  // giống hệt bên website (views/pages/index.ejs dùng Number(...).toFixed(1)
  // để hiển thị), nên để type là string, ép kiểu bằng Number() khi hiển thị.
  average_rating?: string;
  comment_count?: number;
  tags: Tag[];
}

// Điểm đánh giá trung bình của 1 sách, trả riêng từ GET /api/books/:id
// (server tính bằng commentService.getRatingStats, không nằm trong "book").
// average_rating cũng là chuỗi vì cùng lý do ROUND(AVG()) ở trên.
export interface Rating {
  average_rating: string;
  total: number;
}

export interface Comment {
  id: number;
  book_id: number;
  user_id: number | null;
  name: string;
  email: string;
  content: string;
  rating: number;
  created_at: string;
  username: string | null;
}

export interface Pagination {
  requestedPage: number;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  hasPagination: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Format response JSON thống nhất cho mọi endpoint (theo CLAUDE.md mục "API nối web - mobile").
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
