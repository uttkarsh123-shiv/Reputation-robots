import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  
  const sparkleAnim1 = useRef(new Animated.Value(0)).current;
  const sparkleAnim2 = useRef(new Animated.Value(0)).current;
  const sparkleAnim3 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const sparkleAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(sparkleAnim1, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim2, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim3, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(sparkleAnim1, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim2, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim3, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    sparkleAnimation.start();
    pulseAnimation.start();

    return () => {
      sparkleAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

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
        <Text style={styles.price}>
          ₹{item.price ? item.price.toLocaleString('en-IN') : '0'}
        </Text>
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

  const Sparkle = ({ animValue, style }) => (
    <Animated.Text
      style={[
        styles.sparkle,
        style,
        {
          opacity: animValue,
          transform: [
            {
              scale: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1.5],
              }),
            },
          ],
        },
      ]}
    >
      ✨
    </Animated.Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        
        <LinearGradient
          colors={['#000000', '#1a1a1a', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <Sparkle animValue={sparkleAnim1} style={{ top: 10, left: 20 }} />
          <Sparkle animValue={sparkleAnim2} style={{ top: 15, right: 30 }} />
          <Sparkle animValue={sparkleAnim3} style={{ bottom: 15, left: 50 }} />
          <Sparkle animValue={sparkleAnim1} style={{ bottom: 20, right: 60 }} />
          <Sparkle animValue={sparkleAnim2} style={{ top: 40, left: width - 80 }} />
          
          <View style={styles.bannerContent}>
            <View style={styles.saleTag}>
              <Text style={styles.saleTagText}>MEGA SALE</Text>
            </View>
            <Animated.Text
              style={[
                styles.bannerTitle,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              🔥 BLACK FRIDAY 🔥
            </Animated.Text>
            <Text style={styles.bannerSubtitle}>
              Up to 70% OFF on all products!
            </Text>
            <TouchableOpacity style={styles.shopButton}>
              <Text style={styles.shopButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#9ca3af"
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
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, color: '#111' },
  banner: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 20,
  },
  bannerContent: {
    alignItems: 'center',
  },
  saleTag: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  saleTagText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 16,
    textAlign: 'center',
  },
  shopButton: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  shopButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  list: { padding: 8 },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: '100%', height: 150 },
  cardContent: { padding: 12 },
  title: { fontSize: 14, fontWeight: '600', marginBottom: 4, color: '#111' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  favoriteBtn: { 
    position: 'absolute', 
    top: 8, 
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  favoriteIcon: { fontSize: 20 },
  loader: { marginTop: 50 },
});

export default HomeScreen;
