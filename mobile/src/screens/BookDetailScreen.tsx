import { StackScreenProps } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../../App';
import { getBookDetail, getComments, postComment } from '../api/client';
import { Book, Comment, Rating } from '../api/types';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';

type Props = StackScreenProps<RootStackParamList, 'BookDetail'>;

// Màn hình hiển thị nội dung (phần chi tiết + bình luận, đánh giá):
// chi tiết sách + danh sách bình luận hiện có + form gửi bình luận (chỉ hiện
// khi đã đăng nhập, giống rule requireLogin bên web) — yêu cầu tương ứng.
export default function BookDetailScreen({ route }: Props) {
  const { id } = route.params;
  const { user } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [rating, setRatingStats] = useState<Rating | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [content, setContent] = useState('');
  const [selectedStar, setSelectedStar] = useState(5);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadData() {
    setIsLoading(true);
    setLoadError('');
    const [bookResult, commentsResult] = await Promise.all([getBookDetail(id), getComments(id)]);
    if (bookResult.success && bookResult.data) {
      setBook(bookResult.data.book);
      setRatingStats(bookResult.data.rating);
    } else {
      // Không lấy được sách (mất mạng, sai IP, server chưa chạy...) - báo lỗi
      // rõ ràng thay vì để màn hình quay loading mãi không dừng.
      setLoadError(bookResult.message || 'Không tải được thông tin sách.');
    }
    if (commentsResult.success && commentsResult.data) setComments(commentsResult.data.comments);
    setIsLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [id]);

  async function handleSubmitComment() {
    if (content.trim().length < 5) {
      setFormError('Bình luận phải có ít nhất 5 ký tự.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);
    const result = await postComment(id, content.trim(), selectedStar);
    setIsSubmitting(false);

    if (result.success) {
      setContent('');
      setSelectedStar(5);
      loadData();
    } else {
      setFormError(result.message || 'Gửi bình luận thất bại.');
    }
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.center}>
        <Text style={styles.paragraph}>{loadError || 'Không tải được thông tin sách.'}</Text>
        <TouchableOpacity style={[styles.button, styles.retryButton]} onPress={loadData}>
          <Text style={styles.buttonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.cover}>
        <Text style={styles.coverLetter}>{book.title.charAt(0).toUpperCase()}</Text>
      </View>

      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>Tác giả: {book.author}</Text>
      <Text style={styles.rating}>⭐ {Number(rating?.average_rating || 0).toFixed(1)} ({rating ? rating.total : 0} đánh giá)</Text>

      {book.tags.length > 0 && (
        <Text style={styles.tags}>Thể loại: {book.tags.map((t) => t.name).join(', ')}</Text>
      )}

      <Text style={styles.sectionTitle}>Mô tả</Text>
      <Text style={styles.paragraph}>{book.description || 'Chưa có mô tả.'}</Text>

      <Text style={styles.sectionTitle}>Nội dung đánh giá</Text>
      <Text style={styles.paragraph}>{book.review_content || 'Chưa có nội dung đánh giá.'}</Text>

      <Text style={styles.sectionTitle}>Bình luận ({comments.length})</Text>
      {comments.length === 0 ? (
        <Text style={styles.paragraph}>Chưa có bình luận nào.</Text>
      ) : (
        comments.map((comment) => (
          <View key={comment.id} style={styles.comment}>
            <Text style={styles.commentName}>{comment.name} — ⭐ {comment.rating}</Text>
            <Text style={styles.paragraph}>{comment.content}</Text>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>Gửi bình luận và đánh giá</Text>
      {user ? (
        <View>
          <Text style={styles.label}>Chọn điểm đánh giá</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity key={value} onPress={() => setSelectedStar(value)}>
                <Text style={[styles.star, value <= selectedStar && styles.starActive]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.textArea}
            value={content}
            onChangeText={setContent}
            placeholder="Nội dung bình luận..."
            multiline
            numberOfLines={4}
          />

          {formError ? <Text style={styles.error}>{formError}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleSubmitComment} disabled={isSubmitting}>
            {isSubmitting ? <ActivityIndicator color={colors.bg} /> : <Text style={styles.buttonText}>Gửi bình luận</Text>}
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.paragraph}>Vui lòng đăng nhập để gửi bình luận và đánh giá.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  retryButton: { marginTop: 16, paddingHorizontal: 32 },
  content: { padding: 16, paddingBottom: 40 },
  cover: { width: '100%', height: 140, backgroundColor: colors.accent, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  coverLetter: { color: colors.bg, fontSize: 48, fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  author: { fontSize: 14, color: colors.sage, marginTop: 4 },
  rating: { fontSize: 14, color: colors.text, marginTop: 4 },
  tags: { fontSize: 13, color: colors.text, marginTop: 4, fontStyle: 'italic' },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: colors.text, marginTop: 20, marginBottom: 8 },
  paragraph: { fontSize: 14, color: colors.text, lineHeight: 20 },
  comment: { backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 8 },
  commentName: { fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  label: { fontSize: 14, color: colors.text, marginBottom: 6, fontWeight: '600' },
  starsRow: { flexDirection: 'row', marginBottom: 12 },
  star: { fontSize: 32, color: colors.sage, marginRight: 6 },
  starActive: { color: colors.accent },
  textArea: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.sage, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: colors.text, textAlignVertical: 'top', marginBottom: 12 },
  error: { color: colors.danger, backgroundColor: colors.dangerSoft, padding: 10, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: colors.accent, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: colors.bg, fontSize: 16, fontWeight: 'bold' }
});
