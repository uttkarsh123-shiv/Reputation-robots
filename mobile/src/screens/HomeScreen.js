import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products', {
        params: { search, page, limit: 10 },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (productId) => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    try {
      const isFavorite = user.favorites?.some((fav) => fav._id === productId);
      if (isFavorite) {
        await api.delete(`/favorites/${productId}`);
      } else {
        await api.post('/favorites', { productId });
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.price}>₹{item.price.toLocaleString('en-IN')}</Text>
      </View>
      <TouchableOpacity
        style={styles.favoriteBtn}
        onPress={() => toggleFavorite(item._id)}
      >
        <Text style={styles.favoriteIcon}>
          {user?.favorites?.some((fav) => fav._id === item._id) ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: '#fff', padding: 16, paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  searchInput: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  list: { padding: 8 },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: { width: '100%', height: 150 },
  cardContent: { padding: 12 },
  title: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  price: { fontSize: 16, fontWeight: 'bold' },
  favoriteBtn: { position: 'absolute', top: 8, right: 8 },
  favoriteIcon: { fontSize: 24 },
  loader: { marginTop: 50 },
});

export default HomeScreen;
