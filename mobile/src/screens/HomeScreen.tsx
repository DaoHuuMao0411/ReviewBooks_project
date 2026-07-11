import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../../App';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

// Màn hình chính: giới thiệu app, nút vào Danh sách sách / Liên hệ / Đăng nhập
// (hoặc hiện tên user + nút đăng xuất nếu đã đăng nhập) - yêu cầu "Màn hình chính".
export default function HomeScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ReviewBooks</Text>
      <Text style={styles.subtitle}>Trang đánh giá sách</Text>

      {user ? (
        <Text style={styles.welcome}>Xin chào, {user.username}!</Text>
      ) : (
        <Text style={styles.welcome}>Bạn chưa đăng nhập</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BookList')}>
        <Text style={styles.buttonText}>Danh sách sách</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Contact')}>
        <Text style={styles.buttonText}>Ý kiến và liên hệ</Text>
      </TouchableOpacity>

      {user ? (
        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={() => logout()}>
          <Text style={styles.buttonOutlineText}>Đăng xuất</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonOutlineText}>Đăng nhập</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginTop: 4,
    marginBottom: 16
  },
  welcome: {
    fontSize: 15,
    color: colors.sage,
    marginBottom: 24
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12
  },
  buttonText: {
    color: colors.bg,
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent
  },
  buttonOutlineText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: 'bold'
  }
});
