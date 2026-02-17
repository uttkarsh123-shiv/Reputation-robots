import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product, isFavorite, onFavoriteChange }) => {
  const { isAuthenticated } = useAuth();
  const [favorite, setFavorite] = useState(isFavorite);
  const [loading, setLoading] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }

    setLoading(true);
    try {
      if (favorite) {
        await favoritesAPI.remove(product._id);
        setFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await favoritesAPI.add(product._id);
        setFavorite(true);
        toast.success('Added to favorites');
      }
      onFavoriteChange?.();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card overflow-hidden group"
    >
      <Link to={`/products/${product._id}`}>
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteClick}
            disabled={loading}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
          >
            <motion.span
              animate={{ scale: favorite ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl"
            >
              {favorite ? '❤️' : '🤍'}
            </motion.span>
          </motion.button>

          {/* Category Badge */}
          <div className="absolute top-2 left-2 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            {product.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
            {product.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary-600">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">
              Stock: {product.stock}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
