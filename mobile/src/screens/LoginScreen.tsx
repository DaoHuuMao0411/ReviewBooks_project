import { StackScreenProps } from '@react-navigation/stack';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../../App';
import { login as loginApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

// Màn hình đăng nhập: form username/password, gọi API login, lưu user vào AsyncStorage
// (thông qua AuthContext.login) - yêu cầu "Màn hình đăng nhập".
export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (!username.trim() || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }
    setError('');
    setIsLoading(true);
    const result = await loginApi(username.trim(), password);
    setIsLoading(false);

    if (result.success && result.data) {
      await login(result.data.user);
      navigation.navigate('Home');
    } else {
      setError(result.message || 'Đăng nhập thất bại.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tên đăng nhập</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholder="vd. reader"
      />

      <Text style={styles.label}>Mật khẩu</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Mật khẩu"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color={colors.bg} /> : <Text style={styles.buttonText}>Đăng nhập</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 24,
    justifyContent: 'center'
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
    fontWeight: '600'
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.sage,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 15,
    color: colors.text
  },
  error: {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    padding: 10,
    borderRadius: 8,
    marginBottom: 16
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: colors.bg,
    fontSize: 16,
    fontWeight: 'bold'
  }
});
