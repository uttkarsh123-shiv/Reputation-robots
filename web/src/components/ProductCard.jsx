import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product, isFavorite }) => {
  const { isAuthenticated, openLoginModal, reloadUser } = useAuth();
  const [favorite, setFavorite] = useState(isFavorite);
  const [loading, setLoading] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      openLoginModal();
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
      await reloadUser();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300">
      <Link to={`/products/${product._id}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Favorite Button - Keep as is */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteClick}
            disabled={loading}
            className="absolute top-3 right-3 bg-white rounded-full p-2.5 shadow-md hover:shadow-lg transition-all z-10"
          >
            <motion.svg
              animate={favorite ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`w-5 h-5 transition-colors ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              fill={favorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </motion.svg>
          </motion.button>
        </div>

        {/* Content - Minimal Style */}
        <div className="p-4">
          <h3 className="font-medium text-base text-gray-900 mb-1 line-clamp-1">
            {product.title}
          </h3>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
