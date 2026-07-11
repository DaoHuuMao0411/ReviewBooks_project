import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { postContact } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';

// Màn hình ý kiến và liên hệ: form gửi ý kiến (tên, email, nội dung), giống
// trang /contact bên web — yêu cầu "Màn hình ý kiến và liên hệ". Nếu đã đăng
// nhập thì tự điền tên/email từ tài khoản, giống logic GET /contact bên web.
export default function ContactScreen() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.username);
      setEmail(user.email);
    }
  }, [user]);

  async function handleSubmit() {
    if (message.trim().length < 5) {
      setError('Nội dung phải có ít nhất 5 ký tự.');
      setSent(false);
      return;
    }
    setError('');
    setIsSubmitting(true);
    const result = await postContact(name.trim(), email.trim(), subject.trim(), message.trim());
    setIsSubmitting(false);

    if (result.success) {
      setSent(true);
      setMessage('');
    } else {
      setError(result.message || 'Gửi ý kiến thất bại.');
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Họ tên</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Họ tên của bạn" />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="email@vidu.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Tiêu đề</Text>
      <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="Góp ý website" />

      <Text style={styles.label}>Nội dung</Text>
      <TextInput
        style={styles.textArea}
        value={message}
        onChangeText={setMessage}
        placeholder="Nội dung góp ý..."
        multiline
        numberOfLines={5}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {sent ? <Text style={styles.success}>Đã gửi ý kiến thành công. Cảm ơn bạn!</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? <ActivityIndicator color={colors.bg} /> : <Text style={styles.buttonText}>Gửi ý kiến</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 14, color: colors.text, marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.sage, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16, fontSize: 15, color: colors.text },
  textArea: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.sage, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16, fontSize: 15, color: colors.text, textAlignVertical: 'top' },
  error: { color: colors.danger, backgroundColor: colors.dangerSoft, padding: 10, borderRadius: 8, marginBottom: 16 },
  success: { color: colors.sage, padding: 10, borderRadius: 8, marginBottom: 16, fontWeight: 'bold' },
  button: { backgroundColor: colors.accent, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: colors.bg, fontSize: 16, fontWeight: 'bold' }
});
