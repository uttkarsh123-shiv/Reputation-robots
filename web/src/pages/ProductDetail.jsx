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
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to products
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl overflow-hidden border border-gray-200"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-[500px] object-cover"
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
              <span className="inline-block bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Price & Stock */}
            <div className="flex items-baseline gap-4 pb-6 border-b border-gray-200">
              <span className="text-5xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-gray-900">
                About this product
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Favorite Button */}
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFavoriteToggle}
                disabled={favoriteLoading}
                className={`w-full py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2 ${
                  isFavorite
                    ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favoriteLoading ? (
                  'Loading...'
                ) : (
                  isFavorite ? 'Remove from Favorites' : 'Add to Favorites'
                )}
              </motion.button>
            </div>

            {/* Product Details */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Product Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900">{product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Availability</span>
                  <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Product ID</span>
                  <span className="font-mono text-xs text-gray-500">{product._id.slice(-8)}</span>
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
