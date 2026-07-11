import { API_BASE_URL } from '../config';
import { ApiResponse, Book, Comment, Pagination, Rating, User } from './types';

// Hàm dùng chung cho mọi lời gọi API - tránh lặp lại code fetch + parse JSON
// ở từng hàm bên dưới (slide 11. Networking dạy fetch trả về Promise, dùng
// async/await để đọc response.json()).
async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include', // giữ cookie session đăng nhập, giống trình duyệt bên web
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    return await response.json();
  } catch (err) {
    return { success: false, message: 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng.' };
  }
}

// Login/logout nằm ở routes/api/authApi.js, được mount tại /api/auth (routes/api/index.js).
export function login(username: string, password: string): Promise<ApiResponse<{ user: User }>> {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
}

export function logout(): Promise<ApiResponse<null>> {
  return request('/auth/logout', { method: 'POST' });
}

export function getBooks(search: string): Promise<ApiResponse<{ books: Book[]; pagination: Pagination }>> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return request(`/books${query}`);
}

// GET /api/books/:id trả book + rating riêng (rating tính từ commentService.getRatingStats,
// không nằm sẵn trong book như lúc lấy danh sách) - xem routes/api/booksApi.js.
export function getBookDetail(id: number): Promise<ApiResponse<{ book: Book; rating: Rating }>> {
  return request(`/books/${id}`);
}

export function getComments(id: number): Promise<ApiResponse<{ comments: Comment[] }>> {
  return request(`/books/${id}/comments`);
}

export function postComment(id: number, content: string, rating: number): Promise<ApiResponse<null>> {
  return request(`/books/${id}/comments`, { method: 'POST', body: JSON.stringify({ content, rating }) });
}

export function postContact(name: string, email: string, subject: string, message: string): Promise<ApiResponse<null>> {
  return request('/contact', { method: 'POST', body: JSON.stringify({ name, email, subject, message }) });
}
