import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';
import cache from '../utils/cache';

const Home = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const featuredProducts = [
    {
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      title: 'Premium Headphones',
      discount: '70% OFF'
    },
    {
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      title: 'Smart Watches',
      discount: '50% OFF'
    },
    {
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      title: 'Designer Bags',
      discount: '60% OFF'
    },
    {
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
      title: 'Sunglasses',
      discount: '55% OFF'
    },
    {
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
      title: 'Bluetooth Speakers',
      discount: '65% OFF'
    },
  ];

  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const priceRange = searchParams.get('priceRange') || '';

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Other'];
  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: 'Under ₹2,500', value: '0-2500' },
    { label: '₹2,500 - ₹5,000', value: '2500-5000' },
    { label: '₹5,000 - ₹10,000', value: '5000-10000' },
    { label: 'Above ₹10,000', value: '10000-999999' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 12,
          ...(search && { search }),
          ...(category && { category }),
        };

        if (priceRange) {
          const [minPrice, maxPrice] = priceRange.split('-').map(Number);
          params.minPrice = minPrice;
          params.maxPrice = maxPrice;
        }

        const cacheKey = cache.generateKey(params);
        const cachedData = cache.get(cacheKey);
        
        if (cachedData) {
          setProducts(cachedData.products);
          setTotalPages(cachedData.totalPages);
          setTotal(cachedData.total);
          setLoading(false);
          return;
        }

        const response = await productsAPI.getAll(params);
        const data = {
          products: response.data.products,
          totalPages: response.data.totalPages,
          total: response.data.total,
        };

        cache.set(cacheKey, data);

        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch (error) {
        toast.error('Failed to load products');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, search, category, priceRange]);

  const handleSearch = useCallback((searchTerm) => {
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat && cat !== 'All') {
      newParams.set('category', cat);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePriceRangeChange = (range) => {
    const newParams = new URLSearchParams(searchParams);
    if (range) {
      newParams.set('priceRange', range);
    } else {
      newParams.delete('priceRange');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute top-10 left-10 w-16 h-16 bg-yellow-400 rounded-full"
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-20 right-20 w-20 h-20 border-4 border-yellow-400/40"
            animate={{
              rotate: [0, 180, 360],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-400 rounded-full"
            animate={{
              y: [0, 20, 0],
              x: [0, 15, 0],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/3 w-14 h-14 border-4 border-yellow-400/30 transform rotate-45"
            animate={{
              rotate: [45, 225, 45],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-16 h-16 border-4 border-yellow-400/50 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-10 h-10 bg-yellow-400"
            animate={{
              rotate: [0, 90, 180, 270, 360],
              y: [0, -20, 0],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 left-1/2 w-8 h-8 border-4 border-yellow-400/25 rounded-full"
            animate={{
              scale: [1, 1.6, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-40 right-1/2 w-12 h-12 border-4 border-yellow-400/60"
            animate={{
              rotate: [0, -90, -180, -270, -360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-block bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold mb-6 uppercase tracking-wider"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔥 Mega Sale 🔥
              </motion.div>
              
              <motion.h1
                className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                BLACK FRIDAY
              </motion.h1>
              
              <motion.p
                className="text-2xl mb-8 text-gray-300 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Up to 70% OFF on all products!
              </motion.p>
              
              <motion.button
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-10 py-4 rounded-full text-lg transition-all shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Shop Now
              </motion.button>
            </motion.div>

            <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
              <motion.div
                className="flex gap-6 absolute"
                animate={{
                  x: [0, -1800],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                  },
                }}
              >
                {[...featuredProducts, ...featuredProducts].map((product, index) => (
                  <div
                    key={index}
                    className="relative w-[350px] h-[400px] lg:h-[500px] flex-shrink-0 rounded-3xl overflow-hidden shadow-2xl"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="bg-yellow-400 text-black px-4 py-2 rounded-full inline-block text-sm font-bold mb-3">
                        {product.discount}
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {product.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                  Category
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                        (cat === 'All' && !category) || category === cat
                          ? 'bg-black text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                  Price Range
                </h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.value} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={(!priceRange && !range.value) || priceRange === range.value}
                        onChange={() => handlePriceRangeChange(range.value)}
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                      />
                      <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {category || 'Home'}
                </h2>
                <p className="text-sm text-gray-500">
                  {loading ? 'Loading...' : `${total} products available`}
                </p>
              </div>
              <div className="flex-shrink-0 w-80">
                <SearchBar onSearch={handleSearch} initialValue={search} />
              </div>
            </div>

            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl text-gray-600 mb-2">No products found</p>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      isFavorite={user?.favorites?.some((fav) => fav._id === product._id)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
