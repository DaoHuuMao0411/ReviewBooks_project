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

  async function loadBooks(keyword: string) {
    setIsLoading(true);
    const result = await getBooks(keyword);
    if (result.success && result.data) setBooks(result.data.books);
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
          ListEmptyComponent={<Text style={styles.empty}>Không tìm thấy sách nào.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BookDetail', { id: item.id })}>
              <View style={styles.cover}>
                <Text style={styles.coverLetter}>{item.title.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.bookAuthor}>{item.author}</Text>
                <Text style={styles.bookRating}>
                  {'⭐'} {item.average_rating} ({item.comment_count} đánh giá)
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
