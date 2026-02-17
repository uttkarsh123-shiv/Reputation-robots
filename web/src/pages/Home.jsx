import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Other'];

  useEffect(() => {
    fetchProducts();
  }, [search, category, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        ...(search && { search }),
        ...(category && category !== 'All' && { category }),
      };

      const response = await productsAPI.getAll(params);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setPage(1);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat === 'All' ? '' : cat);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 py-20"
      >
        <div className="container mx-auto px-6">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold text-center mb-6 text-gray-900"
          >
            Discover products
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-gray-600 text-lg mb-10 max-w-2xl mx-auto"
          >
            A curated marketplace for quality products
          </motion.p>

          {/* Search Bar */}
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} initialValue={search} />
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  (cat === 'All' && !category) || category === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-900'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-6 py-12">
        {/* Results Info */}
        <div className="mb-8">
          <p className="text-gray-600 text-sm">
            {loading ? (
              'Loading...'
            ) : (
              <>
                {total} {total === 1 ? 'product' : 'products'}
                {search && ` matching "${search}"`}
                {category && ` in ${category}`}
              </>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <Loading />
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-2xl text-gray-400 mb-4">😕</p>
            <p className="text-xl text-gray-600">No products found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isFavorite={user?.favorites?.some((fav) => fav._id === product._id)}
                onFavoriteChange={fetchProducts}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
