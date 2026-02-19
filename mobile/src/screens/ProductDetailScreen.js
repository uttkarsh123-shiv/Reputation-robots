import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Fetch product error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
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

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <TouchableOpacity style={styles.favoriteBtn} onPress={toggleFavorite}>
          <Text style={styles.favoriteBtnText}>
            {user?.favorites?.some((fav) => fav._id === productId)
              ? '❤️ Remove from Favorites'
              : '🤍 Add to Favorites'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 300 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  price: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  category: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  description: { fontSize: 16, lineHeight: 24, color: '#374151', marginBottom: 24 },
  favoriteBtn: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  favoriteBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loader: { flex: 1, justifyContent: 'center' },
});

export default ProductDetailScreen;
