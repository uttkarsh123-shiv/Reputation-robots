import { useState, useEffect } from 'react';
import { favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view favorites');
      navigate('/');
      return;
    }
    fetchFavorites();
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await favoritesAPI.getAll();
      setFavorites(response.data.favorites);
    } catch (error) {
      toast.error('Failed to load favorites');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ❤️ My Favorites
          </h1>
          <p className="text-gray-600">
            {favorites.length === 0
              ? 'No favorites yet'
              : `You have ${favorites.length} favorite ${favorites.length === 1 ? 'product' : 'products'}`}
          </p>
        </motion.div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 card"
          >
            <p className="text-6xl mb-4">💔</p>
            <p className="text-2xl text-gray-600 mb-2">No favorites yet</p>
            <p className="text-gray-500 mb-6">
              Start adding products to your favorites!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Browse Products
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isFavorite={true}
                onFavoriteChange={fetchFavorites}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
