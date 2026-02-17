import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (user && product) {
      setIsFavorite(user.favorites?.some((fav) => fav._id === product._id || fav === product._id));
    }
  }, [user, product]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getOne(id);
      setProduct(response.data.product);
    } catch (error) {
      toast.error('Product not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await favoritesAPI.remove(product._id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await favoritesAPI.add(product._id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-primary-600 transition-colors"
        >
          <span className="text-xl mr-2">←</span>
          Back to products
        </motion.button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="card overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-96 object-cover"
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category Badge */}
            <div>
              <span className="inline-block bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-medium">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-800">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline space-x-4">
              <span className="text-5xl font-bold text-primary-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-gray-500">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFavoriteToggle}
                disabled={favoriteLoading}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  isFavorite
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {favoriteLoading ? (
                  'Loading...'
                ) : (
                  <>
                    {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                  </>
                )}
              </motion.button>
            </div>

            {/* Additional Info */}
            <div className="card p-6 space-y-3">
              <h3 className="font-semibold text-gray-800">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability:</span>
                  <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Product ID:</span>
                  <span className="font-mono text-xs">{product._id}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
