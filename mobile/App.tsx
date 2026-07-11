import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/contexts/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import BookListScreen from './src/screens/BookListScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import ContactScreen from './src/screens/ContactScreen';

// Danh sách màn hình + tham số truyền theo route (slide 08. Navigation).
// BookDetail cần "id" của sách để gọi API chi tiết.
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  BookList: undefined;
  BookDetail: { id: number };
  Contact: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Chỉ dùng 1 Stack Navigator duy nhất chứa cả 5 màn hình (không kết hợp Tab Navigator)
// để đủ đơn giản giải thích, các màn hình điều hướng qua nhau bằng nút bấm thường.
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#a65f2b' },
            headerTintColor: '#f7f1e7',
            headerTitleStyle: { fontWeight: 'bold' }
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ReviewBooks' }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Đăng nhập' }} />
          <Stack.Screen name="BookList" component={BookListScreen} options={{ title: 'Danh sách sách' }} />
          <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Chi tiết sách' }} />
          <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Liên hệ' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
