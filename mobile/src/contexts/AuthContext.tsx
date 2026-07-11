import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { User } from '../api/types';
import { logout as logoutApi } from '../api/client';

const STORAGE_KEY = 'reviewbooks_user';

interface AuthContextValue {
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
}

// Context lưu user hiện tại (slide 05. Hooks - useContext), thay cho Redux
// vì app chỉ có 5 màn hình, state đơn giản (đúng quyết định trong CLAUDE.md).
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Đọc user đã lưu trong AsyncStorage khi mở app lại (slide 10. Data Storage)
  // để không bắt đăng nhập lại mỗi lần mở app.
  // Bọc try/catch vì dữ liệu lưu có thể bị hỏng (không phải JSON hợp lệ) -
  // nếu không bắt lỗi, JSON.parse sẽ throw và làm crash app ngay lúc mở lên.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setUser(JSON.parse(raw));
      })
      .catch(() => {
        // Dữ liệu hỏng - coi như chưa đăng nhập, xoá luôn để lần sau không lỗi lại.
        AsyncStorage.removeItem(STORAGE_KEY);
      });
  }, []);

  async function login(newUser: User) {
    setUser(newUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  }

  async function logout() {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
    await logoutApi(); // huỷ session cookie phía server
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth phải được dùng bên trong AuthProvider');
  return value;
}
