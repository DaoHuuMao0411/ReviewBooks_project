import { StackScreenProps } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../../App';
import { getBooks } from '../api/client';
import { Book } from '../api/types';
import { colors } from '../theme';

type Props = StackScreenProps<RootStackParamList, 'BookList'>;

// Màn hình hiển thị nội dung (phần danh sách): danh sách sách lấy từ API,
// bấm vào 1 sách để sang Book Detail - yêu cầu "Màn hình hiển thị nội dung".
export default function BookListScreen({ navigation }: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  async function loadBooks(keyword: string) {
    setIsLoading(true);
    const result = await getBooks(keyword);
    if (result.success && result.data) {
      setBooks(result.data.books);
      setLoadError('');
    } else {
      // Gọi API thất bại (mất mạng, sai IP...) - phân biệt với trường hợp
      // tìm kiếm không ra kết quả, tránh hiểu lầm "không có sách nào".
      setBooks([]);
      setLoadError(result.message || 'Không tải được danh sách sách.');
    }
    setIsLoading(false);
  }

  useEffect(() => {
    loadBooks('');
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholder="Tìm theo tên sách, tác giả..."
        onSubmitEditing={() => loadBooks(search)}
        returnKeyType="search"
      />

      {isLoading ? (
        <ActivityIndicator style={styles.loading} color={colors.accent} size="large" />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            loadError ? (
              <View>
                <Text style={styles.empty}>{loadError}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => loadBooks(search)}>
                  <Text style={styles.retryButtonText}>Thử lại</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.empty}>Không tìm thấy sách nào.</Text>
            )
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BookDetail', { id: item.id })}>
              <View style={styles.cover}>
                <Text style={styles.coverLetter}>{item.title.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.bookAuthor}>{item.author}</Text>
                <Text style={styles.bookRating}>
                  {'⭐'} {Number(item.average_rating || 0).toFixed(1)} ({item.comment_count} đánh giá)
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16
  },
  search: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.sage,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 15,
    color: colors.text
  },
  loading: {
    marginTop: 32
  },
  empty: {
    textAlign: 'center',
    color: colors.text,
    marginTop: 32
  },
  retryButton: {
    marginTop: 16,
    alignSelf: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8
  },
  retryButtonText: {
    color: colors.bg,
    fontSize: 14,
    fontWeight: 'bold'
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden'
  },
  cover: {
    width: 64,
    height: 64,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center'
  },
  coverLetter: {
    color: colors.bg,
    fontSize: 24,
    fontWeight: 'bold'
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center'
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text
  },
  bookAuthor: {
    fontSize: 13,
    color: colors.sage,
    marginTop: 2
  },
  bookRating: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4
  }
});
